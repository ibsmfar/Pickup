import React from 'react';
import Player from './Player';
import WarningModal from './WarningModal';
import './CurrentGame.css';

class CurrentGame extends React.Component {

  // Show a single player
  renderPlayer(i) {
    const taken = (i <= this.props.players);
    return (
      <Player isTaken={taken}/>
      );
  }

  // Leave this court: either leave an ongoing game or leave the queue
  leaveCourt() {
    // User is not queued and is thus playing on this court
      this.props.removeUserFromActive();
  }

  // Render a modal warning a player that they will lose their spot when joining
  renderModal() {
    return (
      <WarningModal leave={this.props.isPlaying}
                    leaveCourt={ ()=> this.leaveCourt() }
                    courtId={ this.props.courtId }
      />
      );
  }

  // Show a button depending on a player's role in the court (in a queue, in a game, etc.)
  renderButton() {

    if (this.props.isPlaying) {
      return (
        <button type="button" class="btn btn-danger" data-target={`#warningModal${this.props.courtId}`}
        data-toggle="modal">Leave</button>
        );
    }
  }

  render () {
    return (
      <div className='currentgame'>
      	<div className='currentgame-info'>
	        <span className='gametype'>{this.props.gameType} @<br></br></span>
	        <div className='courtname-current'>{this.props.courtName}<br></br></div>
	        <span className='courtaddress-current'>{this.props.courtAddress}</span>
        </div>
        <div className='playerlist-current'>
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
        <div className='button-current'>
          {this.renderButton()}
        </div>
        {this.renderModal()}
      </div>
      );
  }



}

export default CurrentGame;
