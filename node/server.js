const express = require('express');
const sqlite3 = require('sqlite3').verbose();

let app = express();
let db;
let dbName;

app.all('/:name/:z/:x/:y', function (req, res) {

    if (dbName != req.params.name) {
        dbName = req.params.name;
        db = new sqlite3.Database(dbName);
    }

    db.get(`SELECT * FROM tiles WHERE z=${req.params.z} AND x=${req.params.x} AND y=${req.params.y}`, function(err, row){
        try {
            res.set('Content-Type', 'image/png');
            res.end(row.image, 'binary');
        } catch (e) {
            res.status(404).end();
        }
    });
});

app.listen(9999, function () {
    console.log('TileServer on 127.0.0.1:9999');
});
