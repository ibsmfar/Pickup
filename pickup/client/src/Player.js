import React from 'react';
import './Player.css';

class Player extends React.Component {

  render () {
    if (this.props.isTaken) {
      return (
        <div className='player_taken'></div>
        );
    } else {
      return (
        <div className='player_not_taken'></div>
        );
    }
  }
}

export default Player;
