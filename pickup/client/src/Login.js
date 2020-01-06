import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';


/* Component for the Login Page  */
class Login extends React.Component
{

  state = {
		username: "",
		password: "",
		users: [],
		link_to: "",
		admin_credentials: {"admin": "admin"}
	}

	// handleInput = (event) => {
	// 	const value = event.target.value
	// 	const name = event.target.name
  //
	// 	this.setState({
	// 		[name]: value
	// 	})
	// }


	// checkAdmin = () => {
	// 	const username = this.state.username
	// 	const password = this.state.password
	// 	const admin_credentials = this.state.admin_credentials
  //
	// 	if (username === admin_credentials["username"] && password === admin_credentials["password"]) {
	// 			console.log("ADMIN LOGGED IN")
	// 			this.setState({
	// 				link_to: './admin'
	// 			})
	// 	} else {
	// 		console.log("Incorrect username")
	// 	}
	// }

	render() {
		return (
			<div id="login">
			<div>
				<nav class="navbar navbar-default">
					<div class="container-fluid">
						<div class="navbar-header">
							<a id="white" class="navbar-brand" href="/">Pickup</a>
						</div>
						<div class="collapse navbar-collapse">
							<ul class="nav navbar-nav navbar-right">
							</ul>
						</div>
					</div>
				</nav>
			</div>
			<div>
				<div class="container">
					<div id="inputs">
						<h1>Login</h1>
						<input type="text"
							   name="username"
							   // value= {this.state.username}
							   onChange= {e => this.props.setUsername(e.target.value)}
							   placeholder="username" />
						<input type="password"
						       name="password"
						       // value={this.state.password}
						       onChange= {e => this.props.setPassword(e.target.value)}
						       placeholder="password" />
			<div>
				<button class="btn btn-success userLogin" onClick={this.props.userAuthenticate}>Login as User</button>
        <button class="btn btn-success adminLogin" onClick={this.props.adminAuthenticate}>Login as Admin</button>
            </div>
					</div>
				</div>
			</div>
			</div>
		);
	}
}

export default Login;

// <Link to={{pathname: './admin',
            //            sentProps: {
            //            users: this.state.users,
            //         }}}>
