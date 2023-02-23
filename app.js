const http = require('http');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const moment = require('moment');
const log = message => {console.log(`[${moment().format('MM-DD HH:mm:ss.SSS')}] ${message}`)};

const hostname = 'localhost';
const port = 3000;

const createHTMLerror = `
<html lang="en">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Eylexander's API" />
        <meta name="author" content="Eylexander" />
        <meta name="keywords" content="api,project_2b,memes" />
        <link href="./specs/favicon.ico" rel="icon" type="image/x-icon" />
        <title>Project 2B - API</title>
    </head>

    <style>
        html {
            overflow: hidden;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h1 {
            margin: 15% 15% 0 15%;
            font-size: 4em;
            text-align: center;
        }

        p {
            margin: 0 0  15% 0;
            font-size: 1.5em;
            text-align: center;
        }
    </style>

    <body>

        <h1>404</h1>
        <p>This does not exist!</p>
    
    </body>

</html>
`;

const server = http.createServer(async (req, res) => {
    log('Request for ' + req.url + ' by method ' + req.method + ' on status ' + res.statusCode);

    if (req.method == 'GET') {

        if (req.url.startsWith('/images/')) {
            
            var fileUrl = req.url;
            if (fileUrl === '/specs/') {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                return res.end(createHTMLerror);
            }
            
            var filePath = path.resolve(__dirname + fileUrl);
            const fileExt = path.extname(filePath);

            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(createHTMLerror);
                    return log(`File ${filePath} not found!`);
                } else {
                    switch (fileExt) {
                        case '.png':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'image/png');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.jpg':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'image/jpg');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.jpeg':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'image/jpeg');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.PNG':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'image/PNG');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.gif':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'image/gif');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.mp4':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'video/mp4');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.mov':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'video/mov');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.webm':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'video/webm');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.webp':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'image/webp');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        case '.MP4':
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'video/MP4');
                            fs.createReadStream(filePath).pipe(res);
                            break;
                        default:
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/html');
                            res.end(createHTMLerror);
                            break;
                    }
                }
            });

        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');

            const { data } = await axios.get('https://eylexander.xyz/Project-1D/folder.json');

            const contents = data.map(o => o.contents);
            const getFile = contents[0].map(o => o.name);
            const getRandomMeme = getFile[Math.floor(Math.random() * getFile.length)]

            if (getRandomMeme === 'folder.json') {
                getRandomMeme = 'rest_here.mp4';
            }

            const response = {
                meme: `https://eylexander.xyz/Project-1D/${getRandomMeme}`
            };

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(JSON.stringify(response));
            res.end();
        }
    }
});

server.listen(port, hostname, () => {
    log(`Server running at http://${hostname}:${port}/`);
});