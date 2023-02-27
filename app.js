const http = require('http');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const moment = require('moment');
const log = message => {console.log(`[${moment().format('MM-DD HH:mm:ss.SSS')}] ${message}`)};

const hostname = 'api.eylexander.xyz';
const port = 8080;

const createHTMLerror = `
<html lang="en">

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Eylexander's API" />
        <meta name="author" content="Eylexander" />
        <meta name="keywords" content="api,project_2b,memes" />
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
});

server.listen(port, hostname, () => {
    log(`Server running at http://${hostname}:${port}/`);
});