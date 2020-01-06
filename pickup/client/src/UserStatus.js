import React from 'react';
import StatusHeader from './StatusHeader'
import { withRouter } from 'react-router-dom';
import Court from './Court'
import CurrentGame from './CurrentGame'
import "react-datepicker/dist/react-datepicker.css";
import './UserStatus.css'

class UserStatus extends React.Component {

	// Return a user's queue position. If not queued return 0.
	checkQueued(cId) {
		const userQueued = this.props.queuedCourts;
	    const filtered = userQueued.filter((court) => court.courtId === cId);
	    if (filtered.length > 0) {
	      return filtered[0].queuePosition;
	    } else {
	      return 0;
	    }
  	}

	renderCurrentGames() {
		if (this.props.currentCourt !== null) {
			const all_courts = this.props.courts;
			return (
				<div className='currentGameList'>
					<div className='statusDesc'>Games you're currently in:</div>
					<div> {
					all_courts.map( (court) =>{

					if (court._id === this.props.currentCourt) {
          			return(
            			<CurrentGame courtId={court._id}
		                   players={court.players}
		                   gameType={court.gameType}
		                   courtName={court.courtName}
		                   courtAddress={court.courtAddress}
		                   isPlaying={ this.props.currentCourt === court._id } // true if player is playing in this court
		                   removeUserFromActive={ () => this.props.removeUserFromActive(court._id)}
		                />
		                );
          			}
             	    })
           			} </div>
           		</div>
          	);
		}
	}

	renderQueuedGames() {
		if (this.props.queuedCourts.length !== 0) {
			const queued_courts = this.props.courts.filter((court) => this.checkQueued(court._id) > 0);
			return (
				<div className='currentGameList'>
					<div className='statusDesc'>Games you're currently queued for:</div>
					{
					queued_courts.map( (court) =>{

	      			return(
	        			<Court courtId={court._id}
		                   players={court.players}
		                   gameType={court.gameType}
		                   courtName={court.courtName}
		                   courtAddress={court.courtAddress}
		                   courtPic={court.image}
		                   isActive={this.props.currentCourt != null} // true if player is playing at some court
		                   queuePosition={this.checkQueued(court._id)} // returns user's queuePosition
		                   isPlaying={ this.props.currentCourt === court._id } // true if player is playing in this court
		                   queue={court.queued}
		                   addUserToActive={ () => this.props.addUserToActive(court._id)}
		                   addUserToQueue= { () => this.props.addUserToQueue(court._id)}
		                   removeUserFromQueue={() => this.props.removeUserFromQueue(court._id)}
		                   removeUserFromActive={ () => this.props.removeUserFromActive(court._id)}
		                />
		                );
	         	    })
	       			}
	       		</div>
	      	);
		}
	}

	render() {
		// Whether or not to show the default message in the status header
		let showDefault;
		if (this.props.currentCourt === null && this.props.queuedCourts.length === 0) {
			showDefault = true;
		} else {
			showDefault = false;
		}
		return (
			<div id='userstatus'>
					<div className='logout-btn-user'>
						<button type="button" className="btn btn-outline-danger" onClick={this.props.deleteSession}>Log Out</button>
					</div>

				<StatusHeader showDefault={ showDefault } user={this.props.userName}/>
				{this.renderCurrentGames()}
				{this.renderQueuedGames()}
			</div>
			);
	}
}

export default UserStatus;
