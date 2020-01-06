import React from 'react';

import Court from './Court'

class CourtList extends React.Component {

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

  render()
  {
    // const all_courts = this.state.courts;
    const all_courts = this.props.courts;


    return(
      <div>
      {
        all_courts.map( (court) =>{

          return(
            <Court courtId={court._id}
                   players={court.players}
                   gameType={court.gameType}
                   courtName={court.courtName}
                   courtAddress={court.courtAddress}
                   courtPic={court.image}
                   isActive={this.props.currentCourt !== null} // true if player is playing at some court
                   queuePosition={this.checkQueued(court._id)} // true if player is queued at this court
                   isPlaying={ this.props.currentCourt === court._id } // true if player is playing in this court
                   queue={court.queued}
                   addUserToActive={ () => this.props.addUserToActive(court._id)}
                   addUserToQueue= { () => this.props.addUserToQueue(court._id)}
                   removeUserFromQueue={() => this.props.removeUserFromQueue(court._id)}
                   removeUserFromActive={ () => this.props.removeUserFromActive(court._id)}
                   />
          )
        })
      }
      </div>
    );

  }
}
export default CourtList;
