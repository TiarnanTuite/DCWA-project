// Imports
const express = require('express');
const app = express();
const path = require("path");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = 3000;
const MongoClient = require('mongodb').MongoClient;

// Database configuration
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // username root
    password: '',      // password blank
    port: 3306,     // default port
    database: 'dcwa'
});

// Handles connecting to the database
function connectToDatabase(){
    // Connect to database when home page is loaded
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('connected as id ' + connection.threadId);
        });
}

 // Use body-parser middleware to parse request bodies
 app.use(bodyParser.urlencoded({ extended: true }));

 // Used to view a html file
 //app.use(express.static(path.join(__dirname,'pages')));

app.get('/',(req,res)=>{

    connectToDatabase();

    //Load home page
    const filePath = path.join(__dirname, 'pages/home.html');
    res.sendFile(filePath);

    console.log("hi");
});

app.get('/employees', (req, res) =>{
    //Load employees page
    const filePath = path.join(__dirname, 'pages/Employees.html');
    res.sendFile(filePath);
});

app.get('/departments', (req, res) =>{
    //Load employees page
    const filePath = path.join(__dirname, 'pages/Departments.html');
    res.sendFile(filePath);
});

app.get('/empMongo', (req, res) =>{
    //Load employees page
    const filePath = path.join(__dirname, 'pages/EmpMongo.html');
    res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



