const express = require("express");
const app = express();
const http = require('http').createServer(app);
const fs = require('fs');
const mysql = require('mysql');
const io = require('socket.io')(http);
const path = require('path');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: 'node'
});

connection.connect();

/*
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE torunaments (id INT, title VARCHAR(100),descripton MEDIUMTEXT,rules MEDIUMTEXT, banner VARCHAR(100), logo VARCHAR(200))";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table torunaments created");
    });

  });

*/

app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



http.listen(3535, () => {
    console.log("El servidor está inicializado en el puerto 3535");
});

app.get('/db/songs', function (req, res) {
    var sql = `SELECT * from songs`;
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/db/songs/:id', function (req, res) {
    var sql = `SELECT * from songs WHERE id = ${req.params.id}`;
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/featured/index/info', function (req, res) {
    fs.readFile('/var/www/LocoserNode/featured.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
});

app.get('/db/chat/messages', function (req, res) {
    var sql = `SELECT * from chat`;
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/db/tournaments', function (req, res) {
    var sql = `SELECT * from tournaments`;
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/db/tournaments/:id', function (req, res) {
    var sql = `SELECT * from tournaments WHERE id = ${req.params.id}`;
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results);
    });
});

io.on('connection', function(client) {
    //var address = client.handshake.address;
    client.on('chat/message', function(data) {
        client.broadcast.emit('chat/message', data);
        var sql = `INSERT INTO chat (message) VALUES ('${data.message}')`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            con-sole.log("Message inserted");
        });
    });
    
});



/* 
    fs.readFile('test.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
*/
