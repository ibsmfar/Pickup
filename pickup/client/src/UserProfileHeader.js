import React from "react";
import silhouette from './silhouette.png';


class UserProfileHeader extends React.Component{

    render(){
        return (
            <div class= "userprofileheader">
                
                
                <div class ="profilepicture">
                    <img id = "profile-pic-size" src={silhouette}/>
                </div>

                <div class="username">
                    {this.props.username}
                </div>

                    
            </div>
        );
        
    }
}

export default UserProfileHeader;