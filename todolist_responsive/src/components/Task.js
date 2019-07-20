import React, { Component } from 'react';
import Noteslist from './Noteslist.js';
 

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = { task : this.props.t };
 }
  handleDelete = (id) => {
    var http = new XMLHttpRequest();						 
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        var response = http.responseText;
        if(response == "DELETE TASK SUCCESSFUL") {          
          this.props.LoadList();
        }
      }
    }.bind(this);
    var url = 'delete_task/'
    http.open('POST', url, true);
    http.setRequestHeader('id', id);
    http.send();
}
CompleteChange = (task) => {
  const complete = task.complete;     var id = task.id;
  var jsonItem = JSON.stringify([id, complete]);
  var destination = 'ChangeComplete/';
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
      .then(response => response.text())
      .then(cb);
  }
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      throw error;
    }
  }
  function finish(response){
    if(response == "CHANGE COMPLETE SUCCESSFUL") {
      var c = (complete == 0 )? 1 : 0;
      var t = that.state.task;
      t.complete = c;
      that.setState({ task: t })
    }
  }
}
render() {
  var t = this.state.task;
  var tklvl = "";

  switch(t.priority){
    case '1': tklvl = "tklvl DEFCON1"; break;
    case '2': tklvl = "tklvl DEFCON2"; break;
    case '3': tklvl = "tklvl DEFCON3"; break;
    case '4': tklvl = "tklvl DEFCON4"; break;
    case '5': tklvl = "tklvl DEFCON5"; break;
  }
  return (
    <div className = "task" >
      <div className="tktopRow">
        <div  className = "tktitle" >Task: {t.title}</div>
        <div className = "tkCreatedOn">Created On: {t.CreatedDate} </div> 
      </div>
      <div className = "tkdescription"> Description: {t.description} </div>
      <div className = "tknotes"> Notes
        <Noteslist  notes = {t.notes} task = {t} />
      </div>
      <div className="tkbottomRow">
        <span className = {tklvl} > Level {t.priority} Priority </span>
        <span className = "tkdue"> Due Date: {t.duedate} </span>
        <span className = "tkcomplete"> Completed: <input type="checkbox" defaultChecked={t.complete} onChange={ () =>  this.CompleteChange(t)} />  </span>
        <span className = "tkdelspace"> <button onClick = {  () =>  this.handleDelete(t.id)} >Delete</button>  </span>
      </div>
    </div> 
    );
  }
}

export default Task;
