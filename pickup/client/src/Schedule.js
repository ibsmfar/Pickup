import React from 'react';
import Invite from './Invite';
import silhouette from './silhouette.png';
import DatePicker from "react-datepicker";
import './Schedule.css';

class Schedule extends React.Component {

	constructor(props) {
		super(props);
		const { courtName, courtAddress, courtId } = this.props.location.state;
		this.state = {
			name: courtName,
			address: courtAddress,
			id: courtId,
			startTime: new Date(),
			excludedTimes: [], // Server call will populate this with already scheduled times
		}
	}
	
	render() {
		return (
			<div className='schedule'>
				<div className='scheduleCard'>
					<div className='scheduleHeader'>
						<div className='schedule-type'>SCHEDULED GAME @</div>
						<div className='scheduledCourtName'>{this.state.name}</div>
						<div className='scheduledCourtAddr'>{this.state.address}</div>
					</div>
					<div className='schedule-picktime'>
						<div className='schedule-inst'>SELECT AVAILABLE DATE AND TIME</div>
							<div className='calendar'>
								<DatePicker
			      					selected={this.state.startTime}
			      					onChange={(date) => this.setState({startTime: date})}
			      					showTimeSelect
			      					inline
			      					excludeTimes={ this.state.excludeTimes }
			      					dateFormat="MMMM d, yyyy h:mm aa"
			    				/>
		    				</div>
					</div>
					<div className='schedule-invite'>
						<div className='schedule-inst'>INVITE FRIENDS (UP TO <strong>10</strong>)</div>
						<Invite/>
					</div>
					<div className='schedule-buttons'>
						<button type="button" class="btn btn-outline-dark">Schedule</button>
					</div>
				</div>
				<div className='schedule-icon-cont'>
					<img class='sh-pic' src={ silhouette }></img>
				</div>
			</div>
			);
	}
}

export default Schedule;