console.log("To Do List Responsive Start !");

const express = require('express'); 
const path = require('path');
const fs = require('fs');  
const port = 3005;
const sqlite3 = require("sqlite3").verbose();

const month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

//// On start up, set up database, if there already is one delete it.
var file = 'mytodo.db';
fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => { 
	if(!err)  {
		console.log(' Database file exists going to delete now. ');
		fs.unlink(file, (err) => {
			if (err) {
				console.log("Failed to delete database:"+err);
			}
        }); ////Do db delete file.
	} else {
		console.log(' Database file does not exist...');
	}
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		var DROPtableStatement= "DROP TABLE IF EXISTS tasks;";
		db.run(DROPtableStatement);
		var CREATEtableStatement = "CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT,  duedate TEXT, priority TEXT, complete INTEGER, notes BLOB, CreatedDate TEXT )";
		db.run(CREATEtableStatement);
		db.close();
		console.log(" Database created.");
	});
});
////Done Database check if exists and create.



const app = express();

app.use(express.json())

////Set Static Path to Public folder.
app.use(express.static(path.join(__dirname,'public')));
 

////Set up server, listening at http://127.0.0.1:3000
app.listen(port, function() {
	var host = this.address().address;
	var port = this.address().port;
	console.log(" Listening at http://%s:%s", host, port);
});
 


////When a get request for the table happens.
app.get('/table/', function (request, res) { 		
	console.log("\n Recived one GET request for the table. ");	
	try { 
		var db = new sqlite3.Database(file); 
		db.serialize(function(){
			var SELECT_all_Statement = "SELECT * FROM tasks;";			
			db.all(SELECT_all_Statement,[],(err, rows ) => {	
				if(err) {
					console.error(" Error at tryCatch table: "+err.message);
					var unsuccessful = 'COMPUTER ERROR';
					res.send(unsuccessful);
				}else{
					///Parse Notes array.
					for( var i=0; i < rows.length; i++ ) {			
						var arr = rows[i].notes;
						rows[i].notes =	JSON.parse(arr);		
					}
					var jSON_COLLECTION = JSON.stringify(rows);						
					db.close();					
					res.send(jSON_COLLECTION); 		
				}							
			});			
		}.bind(this));	
	} catch(err) {
		console.error(" Error at tryCatch table: "+err.message);
		var unsuccessful = 'COMPUTER ERROR';
		res.send(unsuccessful);
	}
});
////End of when a get request for the table happens.


//// Function checkInputValues
//// Does stuff...
function checkInputValues(input) {
	basket = false;
	try{
		input = JSON.parse(input);
		var title = String( input[0] );
		var description = String( input[1] ); 
		var priority = Number(input[2] ) ;
		var duedate = String( input[3] );
		if( title.match(/[^0-9a-zA-Z \?\!\.\,\t]+/g ) == true || title.length > 35 ){
			basket = false;
		} else if( description.match(/[^0-9a-zA-Z \?\!\.\,\r\n\t\n]+/g ) == true && description.length > 1000 ){
			basket = false;
		}else if( priority < 1 || priority > 5  ) {
			basket = false;
		}else if( duedate.match(/^[0-9]{2}-(January|February|March|April|May|June|July|August|September|October|November|December)-[0-9]{2}$/g) == false){
			basket = false;
		} else {
			basket = [title, description, priority, duedate];
		}
	}catch(err) {
		console.log(" Error at try catch checkInputValues: "+err.message);
		basket = false;
	}
	console.log(basket);
	return basket;
}//// End Function checkInputValues


////When a form post happens.
app.post('/recive_form/', function (request, res) {  		console.log("\n Recived one POST to recive_form. ");	
	var input = request.header('jsonInput');	
	var values = checkInputValues(input);
	if( values ) {
		var db = new sqlite3.Database(file);
		var complete = 0; 
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth();
		var d = date.getDate();
		var CreatedDate = y+" "+month[m]+" "+d;
		var notes = [ ]; 
		notes =  JSON.stringify(notes);
		var title, description, priority, duedate;
		title = values[0];  description = values[1]; priority = values[2]; duedate = values[3];
		var INSERTstatement = "INSERT INTO tasks ( id, title, description, duedate, priority, complete, notes, CreatedDate) values ( null, \""+title+"\", \""+description+"\", \""+duedate+"\", \""+priority+"\", \""+complete+"\", \""+notes+"\", \""+CreatedDate+"\" )";	
		db.run( INSERTstatement, function(err){
			if(err) {
				console.error(" Error at db.run recive_form: "+err.message);
				var unsuccessful = 'COMPUTER ERROR';
				res.send(unsuccessful);
			} else {
				var successful = 'CREATE ENTRY SUCCESSFUL';
				res.send(successful);
				Succesful = true;
			}
			db.close(); 
		});	
	} else {
		console.error(" Error at tryCatch recive_form: "+err.message);
		var unsuccessful = 'COMPUTER ERROR';
		res.send(unsuccessful);
	}	
});
////End of when a form post happens.


 


////When a delete task happens.
app.post('/delete_task/', function (request, res) {  console.log("\n Recived one POST to delete_task.");	
	try {
		var db = new sqlite3.Database(file);
		var unsuccessful = "COMPUTER ERROR"; var success = "DELETE TASK SUCCESSFUL";	
		var input = request.header('id');
		if (input.match(/[^0-9]+/g)) {  /*if input matches anything not a number send res back early saying unsuccessful*/
			res.send(unsuccessful);
		} else {
			var id = Number(input);
			var DeleteStatement = "DELETE FROM tasks WHERE id = '"+id+"';";	
			var db = new sqlite3.Database(file); 
			db.run( DeleteStatement, function(err){
				db.close();
				if(err) { 												
					console.log(" Error at delete_task db.run:"+err.message);  
					res.send(unsuccessful);
				} else {  
					res.send(success);
				}		
			});
		}
	} catch(err) { 
		res.send(unsuccessful);
		console.log(" Error at delete_task TryCatch:"+err.message);  
	}
});
////End of when a delete task happens.





/////When a change complete value occurs
app.post('/ChangeComplete/', function (req, res) { 		
	try {
		console.log("\n Recived one POST to ChangeComplete.");	
		var unsuccessful = "COMPUTER ERROR"; var success = "CHANGE COMPLETE SUCCESSFUL";	
		var body = req.body;  
		var inputID = body[0];
		var inputComplete = body[1];
		var id = Number(inputID);
		var complete = Number(inputComplete);
		if( complete == 0 ) {
			complete = 1; 
		} else {
			complete = 0; 
		}		
		var UPDATEstatement = "UPDATE tasks SET complete = \""+complete+"\" WHERE id = "+id+"; ";	
		var db = new sqlite3.Database(file); 
		db.run( UPDATEstatement, function(err){
			db.close();
			if(err) {   																							
				res.send(unsuccessful);
				console.log(" Error at ChangeComplete db.run:"+err.message);
			} else {						 
				res.send(success);
			}
		});		
	} catch(err){ 
		res.send(unsuccessful);
		console.log(" Error at ChangeComplete TryCatch:"+err.message);  
	}
});
/////End of when a change complete value occurs






////When a new note gets added to a task.
app.post('/AddNote/', function (req, res) { console.log("\n POST to AddNote.");	
	var unsuccessful = JSON.stringify(["COMPUTER ERROR", "[]"]); var success = ["ADD NOTE SUCCESSFUL", "[]"];	
	try { 
		var input = req.body;
		var id = Number(input[0]);
		var value = input[1];	
		if ( value.match(/[^0-9a-zA-Z \?\!\.\,]+/) ) {
			console.log( "AddNote Match failed." );
			res.send(unsuccessful);
		} else {
			var db = new sqlite3.Database(file); 
			db.get('SELECT notes FROM tasks WHERE id = ?;', id, (err, row) => {
				if (err) {
					res.send(unsuccessful);
					console.log(" Error at AddNote db.get SELECT:"+err.message);  
				} else {
					var notes = JSON.parse( row.notes );
					notes.push(value);
					notes = JSON.stringify(notes);
					var db = new sqlite3.Database(file);
					var UPDATEstatement = 'UPDATE tasks SET notes = \''+notes+'\' WHERE id = '+id+' ';	
					db.run( UPDATEstatement, function(err){
						if(err) {
							console.log(" Error at AddNote db.run UPDATE:"+err.message);
							res.send(unsuccessful);
						} else {
							success[1] = notes
							var x = JSON.stringify(success);
							res.send(x);
						}
						db.close();
					});	
				}
			});
		}
	} catch(err){ 
		res.send(unsuccessful);
		console.log(" Error at AddNote TryCatch:"+err.message);  
	}
});
////End of when a new note gets added to a task.