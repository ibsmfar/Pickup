import React from "react";
import UserProfileHeader from './UserProfileHeader';
import Gamelog from './GameLog';
import io from 'socket.io-client';
import UserInfoEdit from './UserInfoEdit';
import { resolve } from "q";

let socket;
class UserProfile extends React.Component {


    constructor(props) {
        super(props);

        socket = io()
        this.state = {
            // users : [
            //     {user: "user",
            //     game_log: [
            //         {Location: "Harbourfront", date: "10-25-2019"},
            //         {Location: "Confederation Park 1", date: "10-23-2019"},
            //         {Location: "Harbourfront", date: "10-15-2019"},
            //         {Location: "Jack Goodland Park", date: "10-10,2019"}
            //     ]              
            //     },
            // ],
            user: this.props.location.state.username,
            game_log: [],
            show: false
        }
        this.toggleInfo = this.toggleInfo.bind(this)

        
    }
    toggleInfo = () => {
        const {show} = this.state;
        this.setState({show: !show})
    }

    render (){
        return (
            <div class = "profilepage">
                <UserProfileHeader username={this.state.user}/>
                <Gamelog/>
                {/* <button onClick={this.toggleInfo}> Edit Profile</button>
                <UserProfileInfoEdit/> */}
                {/* <button class= "edit-profile" onClick={this.toggleInfo}>Edit profile</button>
                {this.state.show && <UserInfoEdit/>} */}
                

            </div>

        );

        
    }
}

export default UserProfile;