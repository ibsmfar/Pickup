import React from 'react';
import './WarningModal.css';

class WarningModal extends React.Component {

	render() {
		
		if (this.props.leave) {
			return(
				<div className='modal fade' id={`warningModal${this.props.courtId}`}>
					<div className='modal-dialog'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h4 className="modal-title">Continue?</h4>
							</div>
							<div className='modal-body'>
								<span>
									By leaving this game you will lose your spot
									on the court or lose your spot on the queue.
								</span>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
								<button type="button" className="btn btn-danger"
								onClick={()=> this.props.leaveCourt()} data-dismiss="modal">Leave</button>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return(
				<div className='modal fade' id={`warningModal${this.props.courtId}`}>
					<div className='modal-dialog'>
						<div className = 'modal-content'>
							<div className ='modal-header'>
								<h4 className ="modal-title">Continue?</h4>
							</div>
							<div className='modal-body'>
								<span>
								By joining this game you will
								lose your spot on the queue for other courts and
								will be unable to queue or join other courts.
								</span>
							</div>
							<div className='modal-footer'>
								<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
								<button type="button" className="btn btn-danger"
								onClick={() => {this.props.takeSpot(); 
								this.props.addUser().then((res) => {
									console.log(res)
									this.props.recordGame();
								})  }}
								 data-dismiss="modal">Join</button>
							</div>
						</div>
					</div>
				</div>
				);
		}
	}
}

export default WarningModal;
