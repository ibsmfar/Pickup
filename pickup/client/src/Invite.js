import React from 'react';
import InvitedPlayer from './InvitedPlayer';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './Invite.css';

class Invite extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			offset: 0,
			invitedUsers: Array(10).fill(null),
			allUsers: ['Jim', 'Kelly', 'Betty', 'Bob', 'Thomas', 'John', 'Diana', 'Eric', 'Mark', 'Anthony']
		}
	}

	// Get all user names from server; requires a server call
	getAllUsers() {
		return this.state.allUsers;
	}

	inviteFriend(eKey) {
		// Retrieve selected user
		const user = eKey;
		const curPlayers = this.state.invitedUsers;

		// Bind selected user to invite spot
		curPlayers[this.state.offset] = user;

		// Remove selected user from list
		const users = this.getAllUsers().filter((name) => name !== user);
		const curOffset = this.state.offset;

		// Simulate a call to server to invite user
		this.setState({offset: curOffset + 1, users: curPlayers, allUsers: users});
	}

	rescindInvite(user) {
		const invited = this.state.invitedUsers;
		if (invited.includes(user)) {
			const newInvited = invited.filter((name) => name !== user);
			newInvited.push(null);
			const newOffset = this.state.offset - 1;
			const newUserPool = this.state.allUsers;
			newUserPool.push(user);

			// Simulate a call to server to rescind user invitation
			this.setState({invitedUsers: newInvited, offset: newOffset, allUsers: newUserPool});
		}
	}

	renderInvitee(i) {
		const userName = this.state.invitedUsers[i];
		if (i < 5) {
			return (<InvitedPlayer userName={userName} isTop={true} rescindInvite={(user)=> this.rescindInvite(user)}/>);
		} else {
			return (<InvitedPlayer userName={userName} isTop={false} rescindInvite={(user)=> this.rescindInvite(user)}/>);
		}
	}

	renderButton() {
		const dropdown_itms = [];
		const users = this.getAllUsers();
		for (let i = 0; i < users; i++) {
			dropdown_itms.push(<Dropdown.Item eventKey={i}>{users[i]}</Dropdown.Item>);
		}
		return (
			<div className='btn-container'>
				<DropdownButton
	        		title='Invite User'
	        		variant='secondary'
	        		id='dropdown-split-variants-secondary'
	        		key='inviteButton'
	        		disabled={!this.state.invitedUsers.includes(null)}
	      		>
	      		 {this.getAllUsers().map((user) => 
	      		 	<Dropdown.Item eventKey={user} onSelect={(eventKey, event)=>this.inviteFriend(eventKey)}>{user}</Dropdown.Item> 
	      		 	)   
	      		 }
	      		</DropdownButton>
	      	</div>
			);
	}


	render() {
		return (
				<div>
					<div className='player-list'>
						<div className='player-row'>
							{[0, 1, 2, 3, 4].map((i) => this.renderInvitee(i))}
						</div>
						<div className='player-row'>
							{[5, 6, 7, 8, 9].map((i) => this.renderInvitee(i))}
						</div>
					</div>
					{this.renderButton()}
				</div>
			);
	}
}

export default Invite;