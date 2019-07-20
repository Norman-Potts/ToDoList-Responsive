import React, { Component } from 'react';
 

class Noteslist extends Component {
  constructor(props) {
	   super(props);
     this.state = { notes : this.props.notes, input: "" };
  }
  inputChange = (event) => {
		var i = event.target.value;
		if (i.length > 0 ) {
			i = i.replace(/[^0-9a-zA-Z \?\!\.\,]+/g, "" );
		}
  	this.setState({input: i});
  }
  insertNote = (e) => {
		e.preventDefault();
		var givenText = this.state.input;     var id = e.target.taskID.value;
		var jsonItem = JSON.stringify([id, givenText]);
		var destination = 'AddNote/';
		const that = this;
 
		sendHer(jsonItem, destination, finish);
		function sendHer(jsonpackage, url, cb) {
			return fetch(url, {
				method: 'post',
				body: jsonpackage,
				headers:{
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			}).then(checkStatus)
			  .then(parseJSON)
              .then(cb);
		}
		function checkStatus(response) {
			if (response.status >= 200 && response.status < 300) {
				return response;
			} else {
				const error = new Error(`HTTP Error ${response.statusText}`);
				error.status = response.statusText;
				error.response = response;
				console.log(error);
				throw error;
			}
		}
		function parseJSON(response) {

			return response.json();
		}
		function finish(response){
			if(response[0] == "ADD NOTE SUCCESSFUL") {
				var n = JSON.parse( response[1]);
				that.setState({ notes:n, input: ""});
			}
		}
  }
  render() {
		var notes = [];
		this.state.notes.forEach((n, i) => (
			notes.push(<li key = {i} >{n}</li>)
		));

    return (
      <div id = "NoteComponent">
    	   <ol>
    	    {notes}
          <form onSubmit = { this.insertNote}  acceptCharset = "utf-8">
    				  <input type="Text" name ="Note" size="20" value={this.state.input} onChange={this.inputChange} ></input>
              <input type="hidden" name = "taskID" value = {this.props.task.id} readOnly></input>
    				  <input type = "Submit" value = "Add Note" readOnly></input>
          </form>
          </ol>
    	</div>
    );
  }
}

export default Noteslist;
