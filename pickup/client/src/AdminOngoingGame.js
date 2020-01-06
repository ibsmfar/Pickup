import React from "react"

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminOngoingGame extends React.Component {
	constructor(props) {
    	super(props)
      this.state = {
        edit: "invisible",
        players: this.props.players,
        courtName: this.props.courtName,
        courtAddress: this.props.courtAddress,
        queue: this.props.queue,
        courtPic: this.props.courtPic
      }
  	}

    toggleDisplay() {
      if (this.state.edit === "invisible") {
        this.state.edit = "visible"
      } else {
        this.state.edit = "invisible"
      }
    }

    handleInput = (event) => {
      const value = event.target.value
      const name = event.target.name

      this.setState({
        [name]: value
      })
    }

    // Database call to update user information
    changeCredential() {
      this.setState({
        username: this.state.newUsername,
        password: this.state.newPassword
      })

      this.toggleDisplay.bind(this) ()
    }

    render() {
      return (
            <div className="cardVisible" class= { this.state.visible }>
              <img id="img-in-card" src={ this.state.courtPic }></img>
              <div class="card-body">
                <h4 class="courtName">{ this.state.courtName }</h4>
                <h6 class="text-center">{ this.state.courtAddress }</h6>
                <h5 class="text-left playersText">Players: { this.state.players } </h5>
                <h5 class="text-right queueText">Queue: { this.state.queue } </h5>
              </div>
            </div>
      )
    }
}

export default AdminOngoingGame