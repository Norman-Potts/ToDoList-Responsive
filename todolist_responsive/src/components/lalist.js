import React, { Component } from 'react';
import Task from './Task.js';

class lalist extends Component {
  render() {
      var tasks = [];
      this.props.internalArr.forEach((tk) => (
        tasks.push(<Task key = {tk.id} t = {tk} LoadList = {this.props.LoadList} />)
      ));
  		return (
  			<div id = "lalist">
  		  	{tasks}
  			</div>
  		);
  }
}

export default lalist;
