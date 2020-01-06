import React from "react";
import { Link } from 'react-router-dom';
import './Sidebar.css'
import silhouette from './silhouette.png';

const mql = window.matchMedia(`(min-width: 800px)`);

class Sidebar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sidebar: "closedSidebar",
      main: "closedMain",
      users: this.props.users
    }
  }

  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
  openNav = () => {
    this.setState({
      sidebar: "openedSidebar",
      main: "openedMain"
    });
  }

  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  closeNav = () => {
    this.setState({
      sidebar: "closedSidebar",
      main: "closedMain"
    });
  }

  render() {
    return (
      <div>
      <div id={this.state.sidebar} class="sidebar">
        <a href="javascript:void(0)" class="closebtn" onClick={this.closeNav}>&times;</a>
        <a href="/">Admin Home</a>
        <Link to={{pathname: '/admin/users',
                   sentProps: {
                   	users: this.state.users
                   }}}>
	        Users
    	  </Link>
        <a href="/admin/games">Games</a>
        <a href="/admin/courts">Courts</a>
        <div className='logout-btn'>
          <button type="button" className="btn btn-outline-danger" onClick={this.props.deleteSession}>Log Out</button>
        </div>
        <img src={ silhouette }></img>
      </div>

      <div class={this.state.main} id="main">
          <button type="button" id="sidebarCollapse" onClick={this.openNav} class="navbar-btn active">
              <span></span>
              <span></span>
              <span></span>
          </button>
      </div>
      </div>
    );
  }
}

export default Sidebar;
