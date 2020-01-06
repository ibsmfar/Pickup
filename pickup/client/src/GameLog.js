import React from "react";

class GameLog extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            game_log: [],
            hasLoaded: false,
            isEmpty: true
        }
    }
    renderTableData(){
        return this.state.game_log.map((game) =>{
            const {courtName, time} = game
            return (
                <tr>
                    <td>{courtName}</td>
                    <td>{time}</td>
                </tr>

            )
        })
    }

    renderTableHeader(){
        //let header = Object.keys(this.state.game_log[0])
        //return header.map((key) => {
        return (<>
                <th>Location</th>
                <th>Date</th>
                </>)
        //})
    }
    getRecords = () => {
        const url = "/records";


        const getRecordsRequest = new Request(url, {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json"
            },
            credentials: "include"
          })
      

        fetch(getRecordsRequest)
        .then(res => res.json())
        .then((json) => {
            console.log(json.length)
            if (json.length > 0){
                this.setState({isEmpty: false})
            }
            this.setState({game_log: json})
            this.setState({hasLoaded: true})
            
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    componentDidMount() {
        this.getRecords();
    }

    render () {
        
        return (
            <>
                {this.state.hasLoaded ? 
                ( 
                    this.state.isEmpty ? (
                        <div id = "gamelist">
                            {/* <h1 id='gamelisttitle'>GameLog</h1> */}
                            <table>
                                <tbody>
                                    <td colspan= "2" id='gamelisttitle'>Gamelog</td>
                                    <tr>{this.renderTableHeader()}</tr>
                                </tbody>
                            </table>
                        </div>
                    ):(
                        <div id = "gamelist">
                            {/* <h1 id='gamelisttitle'>GameLog</h1> */}
                            <table>
                                <tbody>
                                    <td colspan= "2" id='gamelisttitle'>Gamelog</td>
                                    <tr>{this.renderTableHeader()}</tr>
                                    {this.renderTableData()}
                                </tbody>
                            </table>
                        </div>

                    )

                ):(
                    (null)
                )
            }
                
            </>
            
        );

    }
}
export default GameLog;