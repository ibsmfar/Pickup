import React from "react";
import Sidebar from './Sidebar'
import silhouette from './silhouette.png';

const mql = window.matchMedia(`(min-width: 800px)`);

class Admin extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [
        {"userId": 1, "username": "user", "password": "user", "profile_pic": ""},
        {"userId": 2, "username": "user2", "password": "user2", "profile_pic": ""},
        {"userId": 3, "username": "user3", "password": "user3", "profile_pic": ""},
        {"userId": 4, "username": "user4", "password": "user4", "profile_pic": ""},
      ]
    }
    console.log(this.state.users)
  }

  render() {
    return (
      <div>
        <Sidebar users = { this.state.users } deleteSession = { this.props.deleteSession }/>
        <div class="admin-container">
          <h1 id="adminpageHeaderText">Admin Dashboard</h1>
          <h5 id="adminpageText">Welcome! Choose from the options on the right to explore!</h5>
        </div>
      </div>
    );
  }
}

export default Admin;
