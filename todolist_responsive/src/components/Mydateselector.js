import React, { Component } from 'react';

class Mydateselector extends Component {
  constructor(props) {
	   super(props);
        var today = new Date();
   			var dd = today.getDate();
   			var mm = today.getMonth(); //January is 0!
   			var yyyy = today.getFullYear();
   			var Arryears  = [ yyyy, yyyy+1, yyyy+2, yyyy+3, yyyy+4, yyyy+5];
   			var Arrmonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
   			var DisMonth = Arrmonths[mm];
   			var  Arrdays = this.CalculateDaysArr(DisMonth,yyyy);
   			this.state = {
   				Day: dd, Month: DisMonth, Year: yyyy , dayss: Arrdays, monthss: Arrmonths, yearss:Arryears
   			};
  }
  componentWillMount() {
	   this.props.dateChange(this.state.Day, this.state.Month, this.state.Year);
	}
  CalculateDaysArr(month, year) {
    var ArrDays = [];
    var NumDaysinMonth;
     // 31 or 30 days?
    if(month === 'January' || month === 'March' || month === 'May' || month === 'July' || month === 'August' || month === 'October' || month === 'December') {
      NumDaysinMonth = 31;
    } else if(month === 'April' || month === 'June' || month === 'September' || month === 'November') {
      NumDaysinMonth = 30;
    } else {
      // If month is February, calculate whether it is a leap year or not
      var yr = year;
      (yr - 2016) % 4 === 0 ? NumDaysinMonth = 29 : NumDaysinMonth = 28;
    }
    var di= 0;
    do {
      di++;
      ArrDays.push(di);
    }while(di < NumDaysinMonth )
    return ArrDays;
  }
  DayChange = (event) => {
    var d  =  event.target.value;
    var y  = this.state.Year;
    var m  = this.state.Month;
    this.props.dateChange(d, m, y);
    this.setState({ Day: d,});
  }
  MonthChange = (event) => {
    var y  = this.state.Year;
    var m  =  event.target.value;
    var  Arrdays = this.CalculateDaysArr(m,y);
    var d = 0; // Set the new day state to the current state day if the last day of the set month is  is less than the current day state.
    var lstdy = Arrdays.length;
    if ( lstdy < this.state.Day ) {
      d = lstdy;
    } else {
      var s = this.state.Day;
        d = Number(s);
    }
    this.props.dateChange(d, m, y);
    this.setState({ Month: m, dayss: Arrdays, Day: d});
  }
  YearChange = (event) => {
    var m  = this.state.Month;
    var y  =  event.target.value;
    var  Arrdays = this.CalculateDaysArr(m,y);
    var d = 0; // Set the new day state to the current state day if the last day of the set month is  is less than the current day state.
    var lstdy = Arrdays.length;
    if ( lstdy < this.state.Day ) {
      d = lstdy;
    } else {
      var s = this.state.Day;
      d = Number(s);
    }
    this.props.dateChange(d, m, y);
    this.setState({ Year: y, dayss: Arrdays, Day: d });
  }
  render() {
    return (
      <span className = "selectdateblocks">
        <select id="year" name="year"  value={this.state.Year} onChange={this.YearChange}>
                {this.state.yearss.map((item) => (
                <option  key = {item} value = {item} >{item}</option>
              ))}
              </select>

        <select id="month" name="month"  value={this.state.Month} onChange={this.MonthChange}>
              {this.state.monthss.map((item) => (
                <option  key = {item} value = {item} >{item}</option>
              ))}
              </select>

        <select id="day" name="day"  value={this.state.Day} onChange={this.DayChange}>
              {this.state.dayss.map((item) => (
                <option key = {item} value = {item} >{item}</option>
              ))}
              </select>
        
      </span>
    );
  }
}

export default Mydateselector;
