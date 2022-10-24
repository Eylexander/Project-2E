const http = require('http');
const fs = require('fs');
const path = require('path');

const moment = require('moment');
const log = message => {console.log(`[${moment().format('MM-DD HH:mm:ss.SSS')}] ${message}`)};

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    log('Request for ' + req.url + ' by method ' + req.method + ' on status ' + res.statusCode);

    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') fileUrl = '/index.html';
        else fileUrl = req.url;

        var filePath = path.resolve(__dirname + fileUrl);
        const fileExt = path.extname(filePath);
        if (fileExt == '.html') {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    filePath = path.resolve(__dirname + '/404.html');
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                fs.createReadStream(filePath).pipe(res);
            });
        }
        else if (fileExt == '.css') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.ico') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/x-icon');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.png') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/png');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.mp4') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'video/mp4');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.gif') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/gif');
            fs.createReadStream(filePath).pipe(res);
        }
        else if (fileExt == '.jpeg') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'image/jpeg');
            fs.createReadStream(filePath).pipe(res);
        }
        else {
            filePath = path.resolve(__dirname + '/404.html');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        }
    }
    else {
        filePath = path.resolve(__dirname + '/404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
    }
});


server.listen(port, hostname, () => {
    log(`Server running at http://${hostname}:${port}/`);
});