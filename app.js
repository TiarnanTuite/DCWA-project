// Imports
const express = require('express');
const app = express();
const path = require("path");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const port = 3000;

//#region DB Connection
//setting up database connection
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
//#endregion

//Use body-parser to get variable url
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{

    dbConnection();

    const filePath = path.join(__dirname, 'pages/home.html');
    res.sendFile(filePath);
})

//#region employees 
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

//edit employee
app.get('/employee/edit/:eid', (req,res)=>{
    
    //get parameter from the URL
    var eid = req.params.eid;

    //select the user with same eid
    var myQuery = "select * from employee where eid = '" + eid + "'";

    // function updateForm(){
    //     console.log("hi");
    // }

    //get employees from database
    connection.query(myQuery, eid, (error, result) => {
        if (error) {
            console.error(error);
            res.send('Error retrieving employees from database.');
            return;
        }else{

            //store user info connected to EID
            var userInfo = [result[0].ename, result[0].role, result[0].salary];

            //HTML for page
            let editForm =  "<head>" +
                            "<title>Edit Employee</title>" +
                            "<h1>Edit Employee</h1>"+
                            "</head>";

            //create edit form and store in variable
            editForm += '<form style="border: 1px solid black; margin-top: 10px; background: linear-gradient(#e66465, #9198e5); width: 30%; border-collapse: separate";>';

            editForm += '<label>EID</label>';
            editForm += '<input readonly placeholder="'+ eid + '"><br>';
            editForm += '<label>Name</label>';
            editForm += '<input type="text" placeholder="'+ userInfo[0] + '"><br>';
            editForm += '<label>Role</label>';
            editForm += '<input type="text" placeholder="'+ userInfo[1] + '"><br>';
            editForm += '<label>Salary</label>';
            editForm += '<input type="number" placeholder="'+ userInfo[2] + '"><br>';

            //button
            editForm +='<br><button onClick="updateForm()">Update</button>'

            //link to home page
            editForm+= '<br><a href="http://localhost:3000/">Home</a>';

            res.send(editForm);
        }
    });
});

//#endregion

//#region departments 
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
                table += '<td style="border: 1px solid black;"><a href="http://localhost:3000/depts/delete/' + result[i].did + '">Delete</a></td>';
                table += '</tr>';
            }
            table += '</table>';

            //link to home page
            table+= '<a href="http://localhost:3000/">Home</a>';
            
            //send the table to the page
            res.send(table);
        
        }
    });
});

//delete department
app.get('/depts/delete/:did', (req,res)=>{
    
    //get parameter from the URL
    var did = req.params.did;

    //select the user with same eid
    var myQuery = "select * from dept where did = '" + did + "'";

    //get departments from database
    connection.query(myQuery, did, (error, result) => {
        if (error) {
            console.error(error);
            res.send('Error retrieving employees from database.');
            return;
        }else{

            //store user info connected to EID
            var deptInfo = [result[0].dname, result[0].lid, result[0].budget];

            let deleteDept =    "<head>" +
                                "<title>Departments</title>" +
                                "<h1>Departments</h1>"+
                                "</head>";

            //link to home page
            deleteDept += '<br><a href="http://localhost:3000/">Home</a>';

            res.send(deleteDept);
        }
    });
});
//#endregion

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


