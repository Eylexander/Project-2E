const http = require('http');
const axios = require('axios');

const moment = require('moment');
const log = message => {console.log(`[${moment().format('MM-DD HH:mm:ss.SSS')}] ${message}`)};

const hostname = '127.0.0.1';
const port = 8080;

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