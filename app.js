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

var sql = "CREATE TABLE songs (id INT AUTO_INCREMENT, title VARCHAR(100),  thumbnail VARCHAR(100),  route VARCHAR(100))";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table torunaments created");
    });

var values = [
    ['CECI DÍAZ - SI NO SABES WALLEAR    #RADIOSER #HIT2020', '/music/img/1.webp', '/music/1.mp3'],
    ['MAGIAR SCOUT - CECI DIAZ ft MAGIAR SCOUT - CECI DIAZ ft LOCOSER', '/music/img/2.webp', '/music/2.mp3'],
    ['SI TE AGARRO CON MARIO - LOCOSER ft CECI DIAZ', '/music/img/3.webp', '/music/3.mp3'],
    ['CECI DÍAZ - HERA DIJO (NO ES NICOV)  #RADIOSER', '/music/img/4.webp', '/music/4.mp3'],
    ['QUIEREN MATAR A NICOV - LOCOSER', '/music/img/5.webp', '/music/5.mp3'],
    ['LA DOBLE ARQUERIA - CECI DIAZ ft LOCOSER', '/music/img/6.webp', '/music/6.mp3'],
    ['--Locacho Castaña--    [L! Clan Music]', '/music/img/7.webp', '/music/7.mp3'],
    ['--Hombre de Armas-- [L! Clan Music]', '/music/img/8.webp', '/music/8.mp3'],
    ['TERA ME LEVANTO - CECI DIAZ ft LOCOSER', '/music/img/9.webp', '/music/9.mp3'],
    ['[L! Clan Music]  Nunca me dejes Nicov', '/music/img/10.webp', '/music/10.mp3'],
    ['L! Clan Music || Pusheame --Hit del Verano 2020--', '/music/img/11.webp', '/music/11.mp3'],
    ['[L! Clan AGE Music] --Lo GEGEARIA Todo--', '/music/img/12.webp', '/music/12.mp3'],
    ['LOCOSER ft CECI DÍAZ - MESO A MESO  #RADIOSER', '/music/img/13.webp', '/music/13.mp3'],
    ['LOCOSER ft CECI DÍAZ - FUNITO ESTA FORWARD  #RADIOSER', '/music/img/14.webp', '/music/14.mp3'],
    ['Tera ven Rápido [L! Clan Music ft. Keeper]', '/music/img/15.webp', '/music/15.mp3'],
    ['--Leon Migrante--  [L! Clan Music]', '/music/img/16.webp', '/music/16.mp3'],
    ['--La Balada de Viper y la Muerte-- [L! Clan Music]', '/music/img/17.webp', '/music/17.mp3'],
    ['[L! Clan Music]  #LeonesFuimos #DBZ', '/music/img/17.webp', '/music/17.mp3'],
    ['--Cumbion del Age #PrayForBurunito-- [L! Clan Music]', '/music/img/18.webp', '/music/18.mp3'],
    ['L! Clan Music: Tradering Band (El Rock del DE)', '/music/img/19.webp', '/music/19.mp3'],
    ['La Vida esta en Feudal  [L! Clan Music]', '/music/img/20.webp', '/music/20.mp3'],
    ['HIMNO NACIONAL ARGENTINO - CECI DIAZ ft LOCOSER', '/music/img/21.webp', '/music/21.mp3'],
    ['Ese Migra Me Separa [L! Clan Music]', '/music/img/22.webp', '/music/22.mp3'],
    ['L! Clan Music || KT con Pureza', '/music/img/23.webp', '/music/23.mp3'],
    ['L! Clan Music || De Musica Eichera', '/music/img/24.webp', '/music/24.mp3'],
    ['Un Angel para la Edad Imperial   [L! Clan Music]', '/music/img/25.webp', '/music/25.mp3'],
    ['L! Clan Music || La Doble Arqueria', '/music/img/26.webp', '/music/26.mp3'],
    ['La Cumbia del Dinomatero', '/music/img/27.webp', '/music/27.mp3'],
];


values.forEach(song => {
    var sql = `INSERT INTO songs (title, thumbnail, route) VALUES ('${song[0]}', '${song[1]}', '${song[2]}')`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Song inserted");
    });
});



app.use(express.static(path.join(__dirname, 'public')));

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
    fs.readFile(path.join(__dirname, '/public/json/featured.json'), 'utf8', function (err, data) {
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
        var sql = `INSERT INTO chat (message, type) VALUES ('${data.message}', 1)`;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Message inserted");
        });
    });
    
});



/* 
    fs.readFile('test.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.send(data);
    });
*/


/*
CREATE TABLE

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

/*
INSERT MULTIPLE

var values = [
    ['CECI DÍAZ - SI NO SABES WALLEAR    #RADIOSER #HIT2020', '/music/img/1.webp', '/music/1.mp3'],
    ['MAGIAR SCOUT - CECI DIAZ ft MAGIAR SCOUT - CECI DIAZ ft LOCOSER', '/music/img/2.webp', '/music/2.mp3'],
    ['SI TE AGARRO CON MARIO - LOCOSER ft CECI DIAZ', '/music/img/3.webp', '/music/3.mp3'],
    ['CECI DÍAZ - HERA DIJO (NO ES NICOV)  #RADIOSER', '/music/img/4.webp', '/music/4.mp3'],
    ['QUIEREN MATAR A NICOV - LOCOSER', '/music/img/5.webp', '/music/5.mp3'],
    ['LA DOBLE ARQUERIA - CECI DIAZ ft LOCOSER', '/music/img/6.webp', '/music/6.mp3'],
    ['--Locacho Castaña--    [L! Clan Music]', '/music/img/7.webp', '/music/7.mp3'],
    ['--Hombre de Armas-- [L! Clan Music]', '/music/img/8.webp', '/music/8.mp3'],
    ['TERA ME LEVANTO - CECI DIAZ ft LOCOSER', '/music/img/9.webp', '/music/9.mp3'],
    ['[L! Clan Music]  Nunca me dejes Nicov', '/music/img/10.webp', '/music/10.mp3'],
    ['L! Clan Music || Pusheame --Hit del Verano 2020--', '/music/img/11.webp', '/music/11.mp3'],
    ['[L! Clan AGE Music] --Lo GEGEARIA Todo--', '/music/img/12.webp', '/music/12.mp3'],
    ['LOCOSER ft CECI DÍAZ - MESO A MESO  #RADIOSER', '/music/img/13.webp', '/music/13.mp3'],
    ['LOCOSER ft CECI DÍAZ - FUNITO ESTA FORWARD  #RADIOSER', '/music/img/14.webp', '/music/14.mp3'],
    ['Tera ven Rápido [L! Clan Music ft. Keeper]', '/music/img/15.webp', '/music/15.mp3'],
    ['--Leon Migrante--  [L! Clan Music]', '/music/img/16.webp', '/music/16.mp3'],
    ['--La Balada de Viper y la Muerte-- [L! Clan Music]', '/music/img/17.webp', '/music/17.mp3'],
    ['[L! Clan Music]  #LeonesFuimos #DBZ', '/music/img/17.webp', '/music/17.mp3'],
    ['--Cumbion del Age #PrayForBurunito-- [L! Clan Music]', '/music/img/18.webp', '/music/18.mp3'],
    ['L! Clan Music: Tradering Band (El Rock del DE)', '/music/img/19.webp', '/music/19.mp3'],
    ['La Vida esta en Feudal  [L! Clan Music]', '/music/img/20.webp', '/music/20.mp3'],
    ['HIMNO NACIONAL ARGENTINO - CECI DIAZ ft LOCOSER', '/music/img/21.webp', '/music/21.mp3'],
    ['Ese Migra Me Separa [L! Clan Music]', '/music/img/22.webp', '/music/22.mp3'],
    ['L! Clan Music || KT con Pureza', '/music/img/23.webp', '/music/23.mp3'],
    ['L! Clan Music || De Musica Eichera', '/music/img/24.webp', '/music/24.mp3'],
    ['Un Angel para la Edad Imperial   [L! Clan Music]', '/music/img/25.webp', '/music/25.mp3'],
    ['L! Clan Music || La Doble Arqueria', '/music/img/26.webp', '/music/26.mp3'],
    ['La Cumbia del Dinomatero', '/music/img/27.webp', '/music/27.mp3'],
];


values.forEach(song => {
    var sql = `INSERT INTO songs (title, thumbnail, route) VALUES ('${song[0]}', '${song[1]}', '${song[2]}')`
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Song inserted");
    });
});
*/