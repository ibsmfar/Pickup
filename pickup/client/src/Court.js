import React from 'react';

import Player from './Player';
import WarningModal from './WarningModal';
import { Link } from 'react-router-dom';
import './Court.css';

class Court extends React.Component {

  // Show a single player
  renderPlayer(i) {
    const taken = (i <= this.props.players);
    return (
      <Player isTaken={taken}/>
      );
  }

  // Show current queue of this court and user's position in the court
  renderQueue() {
    if (this.props.queuePosition > 0) {
      return (
        <div className='queue'>
            Players queued: {this.props.queue};
            Your position: <span className='queuepos'>{this.props.queuePosition}</span>
        </div>
        );
    } else if (this.props.queue >= 1) {
      return (
        <div className='queue'>
          <span>Players queued: {this.props.queue}</span>
        </div>
        );
    }
  }

  // Enter a game if I haven't joined it (and it is possible to do so)
  takeSpot() {
    if (!this.props.isPlaying) {
      this.props.addUserToActive();
    }
  }

  // Leave this court: either leave an ongoing game or leave the queue
  leaveCourt() {
    // User is not queued and is thus playing on this court
    if (this.props.isPlaying) {
      this.props.removeUserFromActive();
    } else if (this.props.queuePosition > 0) {
      this.props.removeUserFromQueue();
    }

  }

  // Enter this court's queue if I'm not already in it
  queueUp() {
    if (!this.props.isActive && this.props.queuePosition === 0) {
      this.props.addUserToQueue();
    }
  }
  //adds a user to the records db only if they aren't already in it ***************
  addUserToRecords() {
    const url = "/records/addUser"

    const addUserRequest = new Request(url, {
			method: "POST",
			headers: {
				Accept: "*/*",
				"Content-Type": "application/json"
      },
      credentials: "include"
    })
    
    fetch(addUserRequest)
      .then((res)=>{  
        if(res.status === 200){
          res.json();
        } else if (res.status === 400){
          console.log("in here")
          //alert('Unable to add user to records or check if they exist in the records')
          Promise.resolve("hey"); //dummy value to chain then statements
        }
        
      })
      .then((res) => {
        this.recordGame();
      })
      .catch((err) =>{
        console.log(err);
      })

  }

  recordGame(){
    const url = "records/addRecord"

    // getMonth() returns an integer value that is off by 1. January is 0, February is 1, etc
    // This also allow us to get a '01' instead of just a 1
    const getMonthToActualMonth = {
      0: "01",
      1: "02",
      2: "03",
      3: "04",
      4: "05",
      5: "06",
      6: "07",
      7: "08",
      8: "09",
      9: "10",
      10: "11",
      11: "12"
    }

    const currDate = new Date();
    const timeString = currDate.getDate() + '-' + getMonthToActualMonth[currDate.getMonth()] + '-' + currDate.getFullYear();
    const courtName = this.props.courtName;

    const addRecordRequest = new Request(url, {
      method: "POST",
      body: JSON.stringify({
        time: timeString,
        courtName: courtName
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json"
      },
      credentials: "include"
    })

    fetch(addRecordRequest)
      .then((res)=>{
        // if(res.status === 200){
        //   return res.json();
        // } else {
        //   //alert('Unable to add user to records or check if they exist in the records')
        // }
        return res.json();
      })
      .catch((err) =>{
        console.log(err);
      })

  }

  // Render a modal warning a player that they will lose their spot when joining
  renderModal() {
    return (
      <WarningModal leave={this.props.isPlaying || this.props.queuePosition > 0}
                    leaveCourt={ ()=> this.leaveCourt() }
                    takeSpot={ ()=> this.takeSpot() }
                    courtId={ this.props.courtId }
                    courtName={this.props.courtName}
                    addUser={()=>this.addUserToRecords()}
                    recordGame={()=>this.recordGame()}
      />
      );
  }

  // Show a button depending on a player's role in the court (in a queue, in a game, etc.)
  renderButton() {

    if (this.props.isPlaying || this.props.queuePosition > 0) {
      return (
        <button type="button" class="btn btn-danger" data-target={`#warningModal${this.props.courtId}`}
        data-toggle="modal">Leave</button>
        );
    } else if (this.props.players < 10 && this.props.queue < 1) {
      return (
        <button type="button" className="btn btn-outline-secondary" disabled={this.props.isActive}
          data-target={`#warningModal${this.props.courtId}`} data-toggle="modal">Join</button>
        );
    } else if (this.props.players >= 10 || this.props.queue > 0) {
      return (
        <button type="button" className="btn btn-outline-secondary" disabled={this.props.isActive}
          onClick={()=> this.queueUp()}>Queue</button>
        );
    }
  }

  render () {
    return (
      <div className='court'>
        <img className='courtImage' src={this.props.courtPic}></img>
        <div className='gametype'>{this.props.gameType} @</div>
        <div className='courtname'>{this.props.courtName}</div>
        <div className='courtaddress'>{this.props.courtAddress}</div>
        <div className='playerlist'>
          <div className='player-row'>
            {this.renderPlayer(1)}
            {this.renderPlayer(2)}
            {this.renderPlayer(3)}
            {this.renderPlayer(4)}
            {this.renderPlayer(5)}
          </div>
          <div className='player-row'>
            {this.renderPlayer(6)}
            {this.renderPlayer(7)}
            {this.renderPlayer(8)}
            {this.renderPlayer(9)}
            {this.renderPlayer(10)}
          </div>
        </div>
        {this.renderQueue()}
        <div className='buttons'>
          {this.renderButton()}
          <Link to={{pathname: './schedule',
                     state: {
                      courtId: this.props.courtId,
                      courtName: this.props.courtName,
                      courtAddress: this.props.courtAddress
                    }}}>
            <button type="button" className="btn btn-outline-danger">Schedule</button>
          </Link>
        </div>
        {this.renderModal()}
      </div>
      );
  }
}

export default Court;
