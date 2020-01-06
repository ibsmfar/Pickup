import React from "react"
import AdminOngoingGame from './AdminOngoingGame'
import AdminUpcomingGame from './AdminUpcomingGame'
import AdminScheduledGame from './AdminScheduledGame'
import Sidebar from './Sidebar'
import silhouette from './silhouette.png'
import court1 from './court1.jpg'
import court2 from './court2.jpg'
import court3 from './court3.jpg'

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminGamesList extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
        pickup: [],
        scheduled: [],
        imageURL: 'http://res.cloudinary.com/dg88pvg0j/image/upload/c_fill,h_400,w_700/'
    	}
  	}

    componentDidMount() {
      fetch("/pickup-games")
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            alert("Cannot retrieve pickup games!");
          }
        })
        .then (pickup => this.setState({pickup: pickup}))
        .catch(error => console.log(error))

      fetch("/scheduled-games")
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            alert("Cannot retrieve scheduled games!");
          }
        })
        .then (scheduled => this.setState({scheduled: scheduled}))
        .catch(error => console.log(error))
    }

    // Database calls to retrieve games of all types
    getPickup() {
      console.log(this.state.pickup);
      return this.state.pickup
    }

    getScheduled() {
      console.log(this.state.scheduled);
      return this.state.scheduled
    }

  	render() {
      const all_pickup = this.getPickup()
      const all_scheduled = this.getScheduled()

  		return (
  			<div>
  			<div class="custom-container">
  			<div class="adminHeader">
          <Sidebar />
  				<h1 id="adminHeaderText">Admin Dashboard</h1>
  				<h3 id="adminText">Games List</h3>
  			</div>
        <div class="gameType">
          <h4 id="gameType">Pickup Games</h4>
        </div>
        <div>
        {
          all_pickup.map((pickup) => {
            return (
              <AdminUpcomingGame gameId = { pickup._id }
                                 players = { pickup.players.length }
                                 courtName = { pickup.courtName }
                                 courtAddress = { pickup.courtAddress }
                                 queue = { pickup.queued.length }
                                 allPlayers = { pickup.players }
                                 courtPic = { this.state.imageURL + pickup.image }
                                 removedPlayer = { 0 }
              / >
            )
          })
        }
        </div>
        <div class="gameType">
          <h4 id="gameType">Scheduled Games</h4>
        </div>
        <div>
        {
          all_scheduled.map((scheduled) => {
            return (
              <AdminScheduledGame gameId = { scheduled._id }
                                  players = { scheduled.players.length }
                                  courtName = { scheduled.courtName }
                                  courtAddress = { scheduled.courtAddress }
                                  queue = { scheduled.queued.length }
                                  allPlayers = { scheduled.players }
                                  courtPic = { this.state.imageURL + scheduled.image }
                                  removedPlayer = { 0 }
              / >
            )
          })
        }
        </div>
        </div>
  			</div>
  		)
  	}
}

export default AdminGamesList