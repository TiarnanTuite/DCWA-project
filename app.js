// Imports
const express = require('express');
const app = express();
const path = require("path");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const port = 3000;


//setting up for database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // username root
    password: '',      // password blank
    port: 3306,     // default port
    database: 'proj2022'
});

//call to connect to database
function dbConnection(){
    //Connect to database when home page is loaded
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        //output when connected
        console.log('connected as id ' + connection.threadId);
        });
}

//Use body-parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{

    dbConnection();

    const filePath = path.join(__dirname, 'pages/home.html');
    res.sendFile(filePath);
})

//employees table
app.get('/employees', (req, res) => {

    var myQuery = "select * from employee";

    //get employees from database
    connection.query(myQuery, (error, result) => {
        if (error) {
            console.error(error);
            res.send('Error retrieving employees from database.');
            return;
        } else {
            //If query is successfull
            //create table from query result
            let table = '<table style="border: 1px solid black; background: linear-gradient(#e66465, #9198e5); width: 100%; border-collapse: separate"; >';

            //HTML for page
            table +=    "<head>" +
                        "<title>Employees</title>" +
                        "<h1>Employees</h1>"+
                        "</head>";
            //CSS
            table += '<tr style="border: 1px solid black;"><th style="border: 1px solid black;">EID</th><th style="border: 1px solid black;">Name</th><th style="border: 1px solid black;">Role</th><th style="border: 1px solid black;">Salary</th><th style="border: 1px solid black;">Update</th></tr>';

            // Create the table
            for (var i = 0; i < result.length; i++) {
                table += '<tr style="border: 1px solid black;">';
                table += '<td style="border: 1px solid black;">' + result[i].eid + '</td>';
                table += '<td style="border: 1px solid black;">' + result[i].ename + '</td>';
                table += '<td style="border: 1px solid black;">' + result[i].role + '</td>';
                table += '<td style="border: 1px solid black;">' + result[i].salary + '</td>';
                table += '<td style="border: 1px solid black;"><a href="http://localhost:3000/employee/edit/' + result[i].eid + '">Update</a></td>';
                table += '</tr>';
            }
            table += '</table>';
            
            //send the table to the page
            res.send(table);
        
        }
    });
});

app.get('/depts', (req, res) => {

    var myQuery = "select * from dept";

    //get employees from database
    connection.query(myQuery, (error, result) => {
        if (error) {
            console.error(error);
            res.send('Error retrieving departments from database.');
            return;
        } else {
            //If query is successfull
            //create table from query result
            let table = '<table style="border: 1px solid black; background: linear-gradient(#e66465, #9198e5);width: 100%; border-collapse: separate"; >';

            //HTML for dept
            table +=    "<head>" +
                        "<title>Departments</title>" +
                        "<h1>Departments</h1>"+
                        "</head>";
            //CSS
            table += '<tr style="border: 1px solid black;"><th style="border: 1px solid black;">DID</th><th style="border: 1px solid black;">Name</th><th style="border: 1px solid black;">Budget</th><th style="border: 1px solid black;">Location</th><th style="border: 1px solid black;">Delete</th></tr>';

            // Create the table
            for (var i = 0; i < result.length; i++) {
                table += '<tr style="border: 1px solid black;">';
                table += '<td style="border: 1px solid black;">' + result[i].did + '</td>';
                table += '<td style="border: 1px solid black;">' + result[i].dname + '</td>';
                table += '<td style="border: 1px solid black;">' + result[i].budget + '</td>';
                table += '<td style="border: 1px solid black;">' + result[i].lid + '</td>';
                table += '<td style="border: 1px solid black;"><a href="http://localhost:3000/departments/delete/' + result[i].did + '">Delete</a></td>';
                table += '</tr>';
            }
            table += '</table>';
            
            //send the table to the page
            res.send(table);
        
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


