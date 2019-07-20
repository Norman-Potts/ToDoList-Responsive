import React, { Component } from 'react';
import tools from '../tools.js';
import Mydateselector from './Mydateselector.js';

class leform extends Component {
  constructor(props) {
    super(props);
    this.state= { priority:3, title:'', description:'' };
  }
  priorityChange = (event) => {
    var p = event.target.value;
  	this.setState({ priority:p });
  }
  EnterNewTaskClick = (event) => {
    event.preventDefault();
  	var description, title, priority, date;
  	description = this.state.description;
  	title = this.state.title;
  	priority = this.state.priority;
  	date = this.state.date;
  	var formitem =  [ title, description, priority, date ];	  
  	var jsonItem = JSON.stringify( formitem );				 
  	var http = new XMLHttpRequest();						 
  	http.onreadystatechange = function() {
  	   if (http.readyState == 4 && http.status == 200) {
  		     var response = http.responseText;
  				 if(response == "CREATE ENTRY SUCCESSFUL"){
  				       this.setState({ priority: 3, title:'', description:''});
  					     this.props.LoadList();
           }
       }
   }.bind(this);
  	var url = 'recive_form/'
  	http.open('POST', url, true);
  	http.setRequestHeader('jsonInput', jsonItem);
  	http.send(  jsonItem  );
  }
  	 descriptionChange = (event) => {
				var i = event.target.value;
				if (i.length > 0 ) {
					i = i.replace(/[^0-9a-zA-Z \?\!\.\,]+/g, "" );
				}
				this.setState({input: i});
  			this.setState({ description:i });
  		}
  		titleChange = (event) => {
				var i = event.target.value;
				if (i.length > 0 ) {
					i = i.replace(/[^0-9a-zA-Z \?\!\.\,]+/g, "" );
				}
				this.setState({input: i});
  			this.setState({ title:i });
  		}
  		dateChange = (d, m, y) => {
  			var date = y+" "+m+" "+d;
  			this.setState( { date:date } );
  		}
  		render() {
  			return (
  				<form id="leform"> 
						<div id = "containForm">
             <h2>To Do App</h2>
  					<p> Add to To do list. </p>
  					<p> Title: <input className = "inTitle" type="Text" name ="title" size="35" maxLength = "35" value={this.state.title} onChange={this.titleChange} ></input>	</p>
  					<p> Description: </p><p><textarea value={this.state.description}   name ="description" maxLength ="1000" rows="4" cols="50" onChange={this.descriptionChange} ></textarea>	</p>
  					<p> Due Date: <Mydateselector dateChange = {this.dateChange} /> </p>
  					<div><div className = "PriorityBlock" > Priority:  <select id="priority" name="priority"  value={this.state.priority} onChange={this.priorityChange}>
  									<option className = "DEFCON1" value = {1} >Level 1</option>
  									<option className = "DEFCON2" value = {2} >Level 2</option>
  									<option className = "DEFCON3" value = {3} >Level 3</option>
  									<option className = "DEFCON4" value = {4} >Level 4</option>
  									<option className = "DEFCON5" value = {5} >Level 5</option>
  								   </select>
              </div>
              <div>Level 1 most important, level 5 least important.</div>
  					</div>
            <p>
  						<button  onClick = { this.EnterNewTaskClick } > add </button>
  					</p>
						</div>
  				</form>
  			);
  		}
}

export default leform;
