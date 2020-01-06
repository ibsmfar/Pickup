import React from "react"

const mql = window.matchMedia(`(min-width: 800px)`);

class AdminModal extends React.Component {

  	render() {
      console.log(this.props)
  		return (   
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
                <div><span>Court Name</span><input type="test" name="newCourtName" value={ this.props.newCourtName } onChange={ this.props.handleInput.bind(this) } id="newCourtName"></input></div>
                <div><span>Court Address</span><input type="test" name="newCourtAddress" value={ this.props.newCourtAddress } onChange= { this.props.handleInput.bind(this) } id="newCourtAddress"></input></div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" data-dismiss="modal" onClick={ this.props.addNewCourt.bind(this) }  class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
  		)
  	}
}

export default AdminModal