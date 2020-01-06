import React from 'react';
import CourtList from './CourtList';
import UserStatus from './UserStatus';
import NotificationModal from './NotificationModal';
import io from 'socket.io-client';
import './Home.css';

let socket;

class Home extends React.Component {

	constructor(props) {
		super(props);

		socket = io();

		// Initialize state
		this.state = {
			courts: [],
		  user: {
		    game: null,
		    scheduled: [],
		    queued: [],
				userName: 'user'
			},
			userMayEnter: {
				notify: false,
				courtId: 0,
			}
		}
	}

	componentDidMount() {

		// Render courts and user status
		this.updateCourts();
		this.updateStatus();

		// Tells client to update particular court
		socket.on('update court', (updatedCourt) => {
			const storedCourts = this.state.courts;
			storedCourts.forEach((c) => {
				if (c._id === updatedCourt._id) {
					c.players = updatedCourt.players;
					c.queued = updatedCourt.queued;
					c.gameType = updatedCourt.gameType;
				}
			this.setState({courts: storedCourts});
			this.updateStatus();
			});
		});


		// Tells client to update all courts
		socket.on('update all courts', () => {
			console.log("Attempting to update all courts.");
			this.updateCourts();
		});

		// Notify user that they may enter a court (trigger notification modal)
		socket.on('notify user', (court) => {
			this.setState({userMayEnter: {
				notify: true,
				courtId: court
			}})
		})

	}

// Make a server call to retrieve all the courts and their statuses
	updateCourts() {

		const url = "/courts";

		fetch(url)
			.then(res => {
				if (res.status === 200) {
					return res.json();
				} else {
					alert("Could not retrieve courts");
				}
			})
			.then(courtsJSON => {
				// Put it into state
				this.setState({courts: courtsJSON});
			})
			.catch(error => {
				console.log(error);
			})
	}

	// Make a server call to retrieve the player's current status (
  // current game user is in, courts user is queued for, etc.)
	updateStatus() {
		const url = '/status';

		fetch(url)
			.then(res => {
				if (res.status === 200) {
					return res.json();
				} else {
					alert("Could not retrieve current user status");
				}
			})
			.then(userStatus => {
				// Put it into state
				this.setState({user: userStatus});
			})
			.catch(error => {
				console.log(error);
			})
	}

	// Make server call to retrieve court specified by courtId
	updateCourtbyId(courtId) {
		const url = `/courts/${courtId}`;

		fetch(url)
			.then(res => {
				if (res.status === 200) {
					return res.json();
				} else {
					alert(`Could not retreive court ${courtId}`);
				}
			})
			.then(court => {
				const storedCourts = this.state.courts;
				storedCourts.forEach((c) => {
					if (c._id === court._id) {
						c.players = court.players;
						c.queued = court.queued;
						c.gameType = court.gameType;
					}
				});
				this.setState({courts: storedCourts});
			})
			.catch(error => {
				console.log(error);
			})
	}

	// Retrieve court information by id from state
	getCourtbyId(cId) {
		const modCourts = this.state.courts;
		for (const court of modCourts) {
			if (court._id === cId) {
				return court;
			}
		}

		// Could not find court
		return false;
	}

	addToActive(courtId) {
		const removeUrl = '/courts/all/queue';
		const addUrl = `/courts/${courtId}/pickup`;

		// Remove user from all queues
		const requestRemove = new Request(removeUrl, {
			method: "PATCH",
			headers: {
				Accept: "*/*",
				"Content-Type": "application/json"
			}
		})

		fetch(requestRemove)
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				} else {
					alert('Unable remove user from all court queues');
				}
			})
			.then((user) => {
				const requestInit = {
					method: "PATCH",
					body: JSON.stringify({
						enter: true
					}),
					headers: {
						Accept: "*/*",
						"Content-Type": "application/json"
					}
				}

				const requestAdd = new Request(addUrl, requestInit);

				fetch(requestAdd)
					.then((res) => {
						if (res.status === 200) {
							return res.json();
						} else {
							alert("Could not put user into court's active list");
						}
					})
					.catch(error => {
						console.log(error);
					})
			})
			.catch(error => {
				console.log(error);
			})
	}

	removeFromActive(courtId) {
		const url = `/courts/${courtId}/pickup`;

		const request = new Request(url, {
			method: "PATCH",
			body: JSON.stringify({
				enter: false
			}),
			headers: {
				Accept: "*/*",
				"Content-Type": "application/json"
			}
		})

		fetch(request)
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				} else {
					alert(`Could not remove user from court's active list`);
				}
			})
			.then((user) => {
				const newUserState = this.state.user;
				newUserState.game = user.game;
				this.setState({user: newUserState});
				// Update court information
				// this.updateCourtbyId(courtId);
			})
			.catch(error => {
				console.log(error);
			})
	}

	addToQueue(courtId) {
		const getUrl = `/courts/${courtId}`;
		const addUrl = `/courts/${courtId}/queue`;

		fetch(getUrl)
			.then((res) => {
				if (res.status === 200) {
					return res.json();
				} else {
					alert(`Could not retrieve court ${courtId}`);
				}
			})
			.then((court) => {
				// Validation: check if court is full and user is not already queued
				const userQueued = this.state.user.queued.filter((c) => c.courtId === courtId);
				if (court.players === 10 && userQueued.length === 0) {

					const request = new Request(addUrl, {
						method: "PATCH",
						body: JSON.stringify({
							enter: true
						}),
						headers: {
							Accept: "*/*",
							"Content-Type": "application/json"
						}
					})

					fetch(request)
						.then((res) => {
							if (res.status === 200) {
								return res.json();
							} else {
								alert("Could not put user into court's queue");
							}
						})
						.then((user) => {
							// Do something
						})
						.catch(error => {
							console.log(error);
						})
				}
			})
			.catch(error => {
				console.log(error);
			})
	}

	removeFromQueue(courtId) {
		const url = `/courts/${courtId}/queue`;
		const userQueued = this.state.user.queued.filter((c) => c.courtId === courtId);
		if (userQueued.length > 0) {

			const request = new Request(url, {
				method: "PATCH",
				body: JSON.stringify({
					enter: false
				}),
				headers: {
					Accept: "*/*",
					"Content-Type": "application/json"
				}
			})

			fetch(request)
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					} else {
						alert(`Unable remove user from queue of court ${courtId}`);
					}
				})
				.then((user) => {
					// Do something
				})
				.catch(error => {
					console.log(error);
				})
		}
	}

	removeFromQueueAll() {
		const url = `/courts/all/queue`;

		// Proceed if user is in any queue
		if (this.state.user.queued > 0) {
			const request = new Request(url, {
				method: "PATCH",
				headers: {
					Accept: "*/*",
					"Content-Type": "application/json"
				}
			})

			fetch(request)
				.then((res) => {
					if (res.status !== 200) {
						alert('Unable remove user from all court queues');
					}
				})
				.catch(error => {
					console.log(error);
				})
		}
	}

	// Updates user object (erase queuedCourts and change currentCourt) and updates courts
	addUserToActive(cId) {
		// Only allow access if court is not full
		const court = this.state.courts.filter((c) => c._id === cId);
		if (court[0].players < 10) {
			this.addToActive(cId);
		}
	}

	// Updates user object (add to queuedCourts) and update courts
	addUserToQueue(cId) {
		this.addToQueue(cId);
	}

	removeUserFromActive(cId) {

		this.removeFromActive(cId);
	}

  	// Remove this user from the court's queue
	removeUserFromQueue(cId) {
		this.removeFromQueue(cId);
	}

	// Notify a user that they may join a court after queueing
	notifyUser(cId) {
		// Show modal
		if (!this.state.userMayEnter.notify) {
			this.setState({userMayEnter: {notify: true, courtId: cId}});
		}
	}

	// Hide the modal that notifies a user that they may join a game
	acceptInvitation(cId) {
		this.setState({userMayEnter: {notify: false, courtId: 0}})
		this.addUserToActive(cId);
	}

	renderNotifyModal() {
		return (<NotificationModal notify={this.state.userMayEnter.notify}
								   court={this.getCourtbyId(this.state.userMayEnter.courtId)}
								   accept={(cId)=> this.acceptInvitation(cId)}
								   />)
	}

	render() {
		const props = {
			userName: this.state.user.userName,
			courts: this.state.courts,
			currentCourt: this.state.user.game,
			queuedCourts: this.state.user.queued,
			addUserToActive: (cId) => this.addUserToActive(cId),
			addUserToQueue: (cId) => this.addUserToQueue(cId),
			removeUserFromQueue: (cId) => this.removeUserFromQueue(cId),
			removeUserFromActive: (cId) => this.removeUserFromActive(cId),
		}

		return(
			<div>
				<UserStatus  {...props } deleteSession={this.props.deleteSession}/>
				<div className='courtContainer'>
					<div className='allcourts-header'>All Courts:</div>
					<CourtList {...props} />
				</div>
				{this.renderNotifyModal()}
			</div>
			);
	}

}

export default Home;
