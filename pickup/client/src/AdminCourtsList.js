import React from "react"
import AdminCourt from './AdminCourt'
import Sidebar from './Sidebar'
import silhouette from './silhouette.png';
import court1 from './court1.jpg'
import court2 from './court2.jpg'
import court3 from './court3.jpg'

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminCourtsList extends React.Component {
	constructor(props) {
    	super(props)
    	this.state = {
      //   courts: [
      //   {courtId: 1, courtName: "Harbourfront", courtAddress: "627 Queens Quay W", courtPic: court1},
      //   {courtId: 2, courtName: "Jack Goodlad Park", courtAddress: "929 Kennedy Road", courtPic: court2},
      //   {courtId: 3, courtName: "Confederation Park 1", courtAddress: "250 Dolly Varden Blvd", courtPic: court3}
      // ],
      newCourtName: "",
      newCourtAddress: "",
      nextCourtId: 4,
      newCourtImage: "CHANGE LATER",
      courts: []
    	}
  	}

    componentDidMount() {
      // Tells client to update particular court
      fetch("/courts")
        .then(res => {
          if (res.status === 200) {
            return res.json()
          } else {
            alert("Cannot retrieve courts!");
          }
        })
        .then (courts => this.setState({courts: courts}))
        .catch(error => console.log(error))
    }

    // Call to database to retrieve all court information
  	getCourts() {
  		return this.state.courts
  	}

    handleInput(event) {
      const value = event.target.value
      const name = event.target.name

      this.setState({
        [name]: value
      })
    }

    // Call to database to add new court information
    addNewCourt() {
      const request = new Request('/courts', {
        method: "POST",
        body: JSON.stringify({
          courtName: this.state.newCourtName,
          courtAddress: this.state.newCourtAddress,
          image: this.state.newCourtImage
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
            alert("Cannot add court!")
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }

  	render() {
  		const all_courts = this.getCourts()

  		return (
  			<div>
  			<div class="custom-container">
  			<div class="adminHeader">
          <Sidebar/>
  				<h1 id="adminHeaderText">Admin Dashboard</h1>
  				<h3 id="adminText">Courts List</h3>
  			</div>
          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Court</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div><span>Court Name</span><input type="test" name="newCourtName" value={ this.state.newCourtName } onChange={ this.handleInput.bind(this) } id="newCourtName"></input></div>
                <div><span>Court Address</span><input type="test" name="newCourtAddress" value={ this.state.newCourtAddress } onChange= { this.handleInput.bind(this) } id="newCourtAddress"></input></div>
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" data-dismiss="modal" onClick={ this.addNewCourt.bind(this) }  class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
          {
            all_courts.map((court) => {
              return (
                <AdminCourt courtId = { court._id }
                            courtName = { court.courtName }
                            courtAddress = { court.courtAddress }
                            courtPic = { court.image }
                / >
              )
            })
          }
          <a href="#" data-toggle="modal" data-target="#exampleModal" class="btn btn-primary addCourt" 
          onClick= { () => this.state.visible = "cardInvisible" }>Add Court</a>
      	</div>
  			</div>
  		)
  	}
}

export default AdminCourtsList