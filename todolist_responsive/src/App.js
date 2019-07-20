import React, { Component } from 'react';
import Leform from './components/leform.js';
import Lalist from './components/lalist.js';
import './App.css';

class App extends Component {
  constructor(props) {
	   super(props);
     this.state = { internalArr : [] };
  }
  componentWillMount() {
    this.loadArray();
  }
  loadArray = () => {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        var response = http.responseText;
    	  var records  =  JSON.parse( response );
    	  this.setState({   internalArr: records  });
      }
    }.bind(this);
    var url = 'table/'
    http.open('GET', url, true);
    http.send();
  }
  render() {
    return (
      <div id = "App">

			   <Leform LoadList = {this.loadArray} />
			   <Lalist LoadList = {this.loadArray} internalArr = {this.state.internalArr} />
      </div>
    );
  }
}

export default App;
