import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './Invite.css';

class InvitedPlayer extends React.Component {

	render() {

		if (this.props.userName === null) {
			return (
				<div className='invited-player empty'>
					<div className='player-icon'></div>
				</div>
			);
		} else {
			const placement = this.props.isTop ? 'top' : 'bottom';
			const myName = this.props.userName;
			return (
				<OverlayTrigger
      				key={myName}
      				placement={placement}
      				overlay={
        				<Tooltip id={`tooltip-${myName}`}>
          					{myName}
        				</Tooltip>
      				}
    			>
					<div className='invited-player filled'>
						<div className='player-icon'>{myName.toUpperCase().charAt(0)}</div>
						<button type="button" class="remove-btn" onClick={()=> this.props.rescindInvite(myName)}>
							<div className='remove-btn-x'>&times;</div>
						</button>
					</div>
				</OverlayTrigger>
			);
		}
	}
}

export default InvitedPlayer;