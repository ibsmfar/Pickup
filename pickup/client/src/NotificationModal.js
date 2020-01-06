import React from 'react';
import Modal from 'react-bootstrap/Modal';
import './NotificationModal.css'


class NotificationModal extends React.Component {

	render() {
		const showModal = this.props.notify; // True if user can join a game
		const court = this.props.court;
		const courtId = court._id;
		const courtName = court.courtName;
		const courtAddress = court.courtAddress;
		const gameType = court.gameType;

		return (
		<Modal show={showModal} onHide={() => this.props.accept(courtId)}>
        <Modal.Header>
          <Modal.Title>You got next!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	You are ready to play:
        	<div id='court-identifier'>
	        	<span id='nm-gametype'>{gameType} @<br></br></span>
		        <div id='nm-name'>{courtName}<br></br></div>
		        <span id='nm-address'>{courtAddress}</span>
        	</div>
        	By joining this game, you will lose your spot in all queues
	        and will be unable to join the queue for other courts.
        </Modal.Body>
        <Modal.Footer>
          <button class="btn btn-danger" onClick={() => this.props.accept(courtId)}>
            Join
          </button>
        </Modal.Footer>
      </Modal>);
	}
}

export default NotificationModal;
