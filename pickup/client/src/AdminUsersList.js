import React from "react"
import AdminUser from './AdminUser'
import Sidebar from './Sidebar'
import silhouette from './silhouette.png';
import io from 'socket.io-client';

const myId = "5ddcbb23e9ab22391e512521" // For testing; read session id for prod.
const socket = io();
socket.on('init', () => {
  socket.emit('init-ack', `${myId}`);
})

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminUsersList extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
   //  		users: [
			// 	{"userId": 1, "username": "user", "password": "user", "profile_pic": ""},
			// 	{"userId": 2, "username": "user2", "password": "user2", "profile_pic": ""},
			// 	{"userId": 3, "username": "user3", "password": "user3", "profile_pic": ""},
			// 	{"userId": 4, "username": "user4", "password": "user4", "profile_pic": ""},
			// ]
        users: []
    	}
  	}

    componentDidMount() {
      fetch("/users")
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            alert("Cannot retrieve users!");
          }
        })
        .then (users => this.setState({users: users}))
        .catch(error => console.log(error))
    }

  	getUsers() {
		return this.state.users
  	}

  	render() {
  		const all_users = this.getUsers()

  		return (
  			<div>
  			<div class="custom-container">
  			<div class="adminHeader">
          <Sidebar users = { this.state.users } />
  				<h1 id="adminHeaderText">Admin Dashboard</h1>
  				<h3 id="adminText">Active Users</h3>
  			</div>
  				{
  					all_users.map((user) => {
	  					return (
	  						<AdminUser userId = { user._id }
	  							  	   username = { user.userName }
	  							  	   password = { user.password }
	  							       profile_pic = { user.profilePic }
                         scheduled = { user.scheduled.length }
                         queued = { user.queued.length }
	  						/ >
	  					)
  					})
  				}
  			</div>
  			</div>
  		)
  	}
}

export default AdminUsersList