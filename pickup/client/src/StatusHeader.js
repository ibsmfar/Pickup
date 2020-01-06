import React from 'react';
import silhouette from './silhouette.png';
import { Link } from 'react-router-dom';
import './StatusHeader.css'
class StatusHeader extends React.Component {

	render() {
		let message;
		if (this.props.showDefault) {
			message = 'Welcome! Join a game, or queue or schedule a future one.';
		} else {
			message = 'Your current, scheduled and queued games are listed below.';
		}
		return (
			<div id='statusheader'>
				<div class='sh-banner'>
					<div class='sh-greeting'>Hello <Link className='userProfileLink'to={{pathname:"/userprofile", state:{username:this.props.user}}}>{this.props.user}</Link>.</div>
					<div class='sh-pic-container'>
						<img class='sh-pic' src={ silhouette }></img>
					</div>
				</div>
				<div class='sh-intro'>
					<span>{ message }</span>
				</div>
			</div>
			);
	}

}

export default StatusHeader;
