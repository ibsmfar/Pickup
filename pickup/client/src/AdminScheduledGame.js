import React from "react"

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminScheduledGame extends React.Component {
  constructor(props) {
      super(props)
      this.deletePlayer = this.deletePlayer.bind(this)
      this.updateGame = this.updateGame.bind(this)
      this.state = {
        edit: "invisible",
        table: "invisible",
        gameId: this.props.gameId,
        players: this.props.players,
        courtName: this.props.courtName,
        courtAddress: this.props.courtAddress,
        queue: this.props.queue,
        allPlayers: this.props.allPlayers,
        playersList: [],
        removedPlayers: [],
        removedPlayer: this.props.removedPlayer,
        courtPic: this.props.courtPic 
      }
    }

    componentDidMount() {
      var newPlayersList = []; 
      var newAllPlayersList = []; 
      var newRemovedPlayer = [];
      for (var i = 0; i < this.state.allPlayers.length; i++) {
        const url = "/users/" + this.state.allPlayers[i]
        fetch(url)
          .then(res => {
            if (res.status === 200) {
              return res.json()
            } else {
            }
          })
          .then (user => { newPlayersList.push(user.userName); 
                           newAllPlayersList.push(user._id);
                           this.setState({ playersList: newPlayersList, allPlayers: newAllPlayersList, removedPlayer: newRemovedPlayer }) })
          .then(() => this.assignVisibility())
          .catch(error => console.log(error))
      }
    }

    assignVisibility() {
      var removedPlayers = []
      for (var i = 0; i < this.state.players; i++) {
        removedPlayers.push("visible")
      }

      this.setState({
        removedPlayers: removedPlayers
      })
    }

    deletePlayer(e) {
      // this.setState({
      //   removedPlayer: [e.target.name]
      // })
      var newPlayersList = this.state.playersList
      var newAllPlayers = this.state.allPlayers
      var removedPlayer = [e.target.name]
      var newPlayers = this.state.players

      for (var i = 0; i < newPlayers; i++) {
        console.log("Out");
        if (newAllPlayers[i] == removedPlayer[0]) {
          console.log("In");
          newPlayersList.splice(i, 1)
          newAllPlayers.splice(i, 1)
          newPlayers--
          break
        }
      }

      this.setState({
        playersList: newPlayersList,
        allPlayers: newAllPlayers,
        players: newPlayers
      })

      this.updateGame(e)
    }

    deleteGame() {
      const url = `/games/remove/admin`

      const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify({
          gameId: this.state.gameId
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
            alert("Cannot delete game!")
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    updateGame(e) {
      const url = `/scheduled/remove-user`

      const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify({
          allPlayers: this.state.allPlayers,
          gameId: this.state.gameId,
          removedPlayer: e.target.name
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
            alert("Cannot update game!")
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    toggleDisplay() {
      if (this.state.edit === "invisible") {
        this.state.edit = "visible"
      } else {
        this.state.edit = "invisible"
      }

      this.toggleTableDisplay()
    }

    toggleTableDisplay() {
      if (this.state.edit === "visible" && this.state.players > 0) {
        this.state.table = "visible"
      } else {
        this.state.table = "invisible"
      }
    }

    render() {
      var rows = []
      for (var i = 0; i < this.state.players; i++) {
          var cell = []
          cell.push(<td class="usernameTable {this.state.removedPlayers[i]}"> { this.state.playersList[i] }</td>)
          cell.push(<td><a href="#" name={ this.state.allPlayers[i] }
                                    onClick= { this.deletePlayer }>Remove</a></td>)
          rows.push(<tr class= {this.state.removedPlayers[i]}> { cell } </tr>)
      }

      return (
            <div className="cardVisible" class= { this.state.visible }>
              <img id="img-in-card" src={ this.state.courtPic }></img>
              <div class="card-body">
                <h4 class="courtName">{ this.state.courtName }</h4>
                <h6 class="text-center">{ this.state.courtAddress }</h6>
                <h5 class="text-left playersText">Players: { this.state.players } </h5>
                <h5 class="text-right queueText">Queue: { this.state.queue } </h5>
                <a href="#" class="btn btn-primary users-btn" onClick= { this.toggleDisplay.bind(this) }>Edit</a>
                <a href="#" class="btn btn-primary users-btn" onClick= { () => { this.state.visible = "cardInvisible"; this.deleteGame(); } }>Delete</a>
                <table id="playersTable" className={ this.state.table }>
                  <tr>
                    <th>Username</th>
                  </tr>
                  { rows }
                </table>
              </div>
            </div>
      )
    }
}

export default AdminScheduledGame