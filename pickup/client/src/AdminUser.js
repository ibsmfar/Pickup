import React from "react"
import silhouette from './silhouette.png';

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminUser extends React.Component {
	constructor(props) {
    	super(props)
      this.state = {
        edit: "invisible",
        userId: this.props.userId,
        username: this.props.username,
        password: this.props.password,
        scheduled: this.props.scheduled,
        queued: this.props.queued,
        newUsername: "",
        newPassword: "",
        profile_pic: this.props.profile_pic,
        visible: "cardVisible"
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

    deleteUser() {
      const url = `/users/remove/admin`

      // const url = "/users/" + this.state.userId + "/remove"

      // fetch(url)
      //   .then(res => {
      //     if (res.status === 200) {
      //       return res.json()
      //     } else {
      //       alert("Cannot delete user!");
      //     }
      //   })
      //   .catch(error => console.log(error))


      const request = new Request(url, {
        method: "DELETE",
        body: JSON.stringify({
          userId: this.state.userId
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
            alert("Cannot delete user!")
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    // Requires database call to update user information
    changeCredential() {
      this.setState({
        username: this.state.newUsername,
        password: this.state.newPassword
      })

      this.toggleDisplay.bind(this) ()

      this.updateCredential()
    }

    updateCredential() {
      const url = `/users/${this.state.userId}/admin`

      const request = new Request(url, {
        method: "PATCH",
        body: JSON.stringify({
          username: this.state.newUsername,
          password: this.state.newPassword
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
            alert(`Cannot update user's credentials`)
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

    // removeFromActive(courtId) {
    //   const url = `/courts/${courtId}/pickup`;

    //   const request = new Request(url, {
    //     method: "PATCH",
    //     body: JSON.stringify({
    //       user: myId,
    //       enter: false
    //     }),
    //     headers: {
    //       Accept: "*/*",
    //       "Content-Type": "application/json"
    //     }
    //   })

    //   fetch(request)
    //     .then((res) => {
    //       if (res.status === 200) {
    //         return res.json();
    //       } else {
    //         alert(`Could not remove user from court's active list`);
    //       }
    //     })
    //     .then((user) => {
    //       const newUserState = this.state.user;
    //       newUserState.game = user.game;
    //       this.setState({user: newUserState});
    //       // Update court information
    //       // this.updateCourtbyId(courtId);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     })
    // }

    render() {
      return (
            <div className="cardVisible" class= { this.state.visible }>
              <img id="img-in-card" src={ silhouette }></img>
              <div class="card-body">
                <h5>Username: { this.state.username } </h5>
                <h5> Scheduled: { this.state.scheduled } </h5>
                <h5 class="queued"> Queued: { this.state.queued } </h5>
                <a href="#" class="btn btn-primary users-btn" onClick= { this.toggleDisplay.bind(this) }>Edit</a>
                <a href="#" class="btn btn-primary users-btn" onClick= { () => { this.state.visible = "cardInvisible"; this.deleteUser(); }}>Delete</a>
                <h5 id="new" class={ this.state.edit }>New Username: <input id="newCredential" type="text" name="newUsername"
                 onChange= {this.handleInput} placeholder="username"></input></h5>
                <h5 class={ this.state.edit }>New Password: <input id="newCredential" type="text" name="newPassword"
                 onChange= {this.handleInput} placeholder="password"></input></h5>
                <a href="#" class={ this.state.edit } onClick= { this.changeCredential.bind(this) }>Submit</a>
              </div>
            </div>
      )
    }
}

export default AdminUser