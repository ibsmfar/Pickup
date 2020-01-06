import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Schedule from './Schedule';
import Admin from './Admin'
import AdminUsersList from './AdminUsersList'
import AdminGamesList from './AdminGamesList'
import AdminCourtsList from './AdminCourtsList'
import UserProfile from './UserProfile';
import './App.css';


class App extends React.Component
{
	constructor(props) {
		super(props);
		this.state = {
			screen: null,
			username: null,
			password: null,
		};
	}

	// Set username in state
	setUsername = (username) => {
			this.setState({username: username});
	}

	// Set password in state
	setPassword = (password) => {
			this.setState({password: password});
	}

	// mode can be user or admin
	authenticate = (mode) => {
		const url = `/${mode}/login`;

		const request = new Request(url, {
      method: "post",
      body: JSON.stringify({ username: this.state.username, password: this.state.password }),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    });

    // Send the request with fetch()
    fetch(request)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(json => {
        if (json.screen === 'unauthorized') {
					alert('Please enter a valid username/password.');
        } else {
					this.setState({screen: json.screen});
				}
      })
      .catch(error => {
        console.log(error);
      });
	}

	// Send admin/user to log in page. Use 'users' for user and 'admin' for admin
	deleteSession = () => {
		const url = '/users/logout';

		fetch(url)
			.then(res => {
				this.setState({screen: "unauthorized"});
			})
			.catch(error => {
				console.log(error);
			});
	}

	readCookie = () => {
    const url = "/users/check-session";

    fetch(url)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(json => {
        if (json.screen !== undefined) {
          this.setState({screen: json.screen});
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

	componentDidMount() {
		this.readCookie();
	}

	// Render authenticated views
	renderAuth() {

		// User has logged in
		if (this.state.screen === 'user_auth') {
			return (
			<BrowserRouter>
				<Switch>
				   <Route exact path="/userprofile" component={UserProfile}/>
					 <Route exact path="/*" render = {props => <Home deleteSession={this.deleteSession}/>}/>
				</Switch>
			</BrowserRouter>
		);

		// Admin has logged in
		} else if (this.state.screen === 'admin_auth') {
			return (
			<BrowserRouter>
				<Switch>
					 <Route exact path="/admin/users" component={AdminUsersList}/>
					 <Route exact path="/admin/games" component={AdminGamesList}/>
					 <Route exact path="/admin/courts" component={AdminCourtsList}/>
					 <Route exact path="/*" render = {props => <Admin deleteSession={this.deleteSession}/>}/>
				</Switch>
			</BrowserRouter>
		);

		}
	}

	render()
	{
		return(
			<div id="app-div">
			{this.state.screen === 'user_auth' || this.state.screen === 'admin_auth' ?
				this.renderAuth()
				 :
				<Login setUsername={this.setUsername}
							 setPassword={this.setPassword}
							 userAuthenticate={() => this.authenticate('users')}
							 adminAuthenticate={()=> this.authenticate('admin')}
							 />
			}
			</div>
		)
	}
}

export default App;
