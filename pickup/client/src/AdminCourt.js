import React from "react"

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminCourt extends React.Component {
	constructor(props) {
    	super(props)
      this.deleteGame = this.deleteGame.bind(this)
      this.state = {
        courtId: this.props.courtId,
        courtName: this.props.courtName,
        courtAddress: this.props.courtAddress,
        courtPic: this.props.courtPic,
        players: this.props.players,
        queued: this.props.queued
      }
  	}

    deleteCourt() {
      const url = `/courts/remove/admin`

      const request = new Request(url, {
        method: "DELETE",
        body: JSON.stringify({
          courtId: this.state.courtId
        }),
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json"
        }
      })

      fetch(request)
        .then((res) => {
          if (res.status === 200) {
            return res.json()
          } else {
            alert("Cannot delete court!")
          }
        })
        .then(() => this.deleteGame())
        .catch((error) => {
          console.log(error);
        })
    }

    deleteGame() {
      const url = `/users/remove-game/admin`

      const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify({
          players: this.state.players,
          queued: this.state.queued
        }),
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json"
        }
      })

      fetch(request)
        .then((res) => {
          if (res.status === 200) {
            return res.json()
          } else {
            alert("Cannot delete game for user!")
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    render() {
      return (
            <div className="cardVisible" class= { this.state.visible }>
              <img id="img-in-card" src={ this.state.courtPic }></img>
              <div class="card-body">
                <h4 class="courtName">{ this.state.courtName }</h4>
                <h6 class="text-center">{ this.state.courtAddress }</h6>
                <a href="#" class="btn btn-primary delete-btn text-center" onClick= { () => { this.deleteCourt(); this.state.visible = "cardInvisible"; } }>Delete</a>
              </div>
            </div>
      )
    }
}

export default AdminCourt