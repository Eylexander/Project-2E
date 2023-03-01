const http = require('http');
const axios = require('axios');

const moment = require('moment');
const log = message => {console.log(`[${moment().format('MM-DD HH:mm:ss.SSS')}] ${message}`)};

const port = 8080;

const requestListener = async function (req, res) {
    log('Request for ' + req.url + ' by method ' + req.method + ' on status ' + res.statusCode);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { data } = await axios.get('https://eylexander.xyz/memes/folder.json');

    const contents = data.map(o => o.contents);
    const getFile = contents[0].map(o => o.name);
    const getRandomMeme = getFile[Math.floor(Math.random() * getFile.length)];

    if (getRandomMeme === 'folder.json' || getRandomMeme === 'index.html') {
        getRandomMeme = 'rest_here.mp4';
    }

    const response = {
        name: getRandomMeme,
        url: `https://eylexander.xyz/memes/${getRandomMeme}`
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
}

const server = http.createServer(requestListener);

server.listen(port, () => {
    log(`Server running on port : ${port}`);
});