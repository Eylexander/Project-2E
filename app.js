const http = require('http');
const axios = require('axios');
const fs = require('fs');

const moment = require('moment');
const log = message => {console.log(`[${moment().format('MM-DD HH:mm:ss.SSS')}] ${message}`)};

const port = 8080;
const cacheTime = 3600 * 1000 * 12; // 12 hours cache time
let cache = [];

const requestListener = async function (req, res) {
    const args = new URL(req.url, `https://${req.headers.host}`);
    
    // Check if the request method is valid
    if (req.method !== 'GET' || !args.pathname.startsWith('/api/v1')) {
        res.statusCode = 405; // Method Not Allowed
        return res.end();
    } else if (req.url === '/favicon.ico') {
        return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');


    // Generate a cache key for the request
    const cacheKey = args.searchParams.toString();

    // Check if the response is already cached
    if (cache[cacheKey] && Date.now() - cache[cacheKey].time < cacheTime && ['array', 'list'].includes(args.searchParams.get('type'))) {
        log('Serving from cache');
        return res.end(JSON.stringify(cache[cacheKey].data));
    }

    let data = null;
    try {
        data = JSON.parse(fs.readFileSync('../memes/folder.json'));
    } catch (e) {
        const response = await axios.get('https://memes.eylexander.xyz/folder.json');
        data = response.data;
    }

    const contents = data.map(o => o.contents);
    const getFile = contents[0].filter(o => o.type === 'file').map(o => o.name);

    let file = null;
    if (args.searchParams.get('get') || args.searchParams.get('search') || args.searchParams.get('type')) {
        switch(args.searchParams.get('get')) {
            case 'jpg':
                file = getFile.filter(o => o.endsWith('.jpg'));
                break;

            case 'png':
                file = getFile.filter(o => o.endsWith('.png'));
                break;

            case 'jpeg':
                file = getFile.filter(o => o.endsWith('.jpeg'));
                break;

            case 'gif':
                file = getFile.filter(o => o.endsWith('.gif'));
                break;

            case 'webp':
                file = getFile.filter(o => o.endsWith('.webp'));
                break;

            case 'mp4':
                file = getFile.filter(o => o.endsWith('.mp4'));
                break;

            case 'webm':
                file = getFile.filter(o => o.endsWith('.webm'));
                break;

            case 'mov':
                file = getFile.filter(o => o.endsWith('.mov'));
                break;

            case 'image':
                file = getFile.filter(o => ['jpg', 'png', 'jpeg', 'gif', 'webp'].some(t => o.endsWith('.' + t)));
                break;

            case 'video':
                file = getFile.filter(o => ['mp4', 'webm', 'mov'].some(t => o.endsWith('.' + t)));
                break;
        }

        if (args.searchParams.get('search')) {
            if (file != null) {
                file = file.filter(o => o.toLocaleLowerCase().includes(args.searchParams.get('search').toLocaleLowerCase()));
            } else {
                file = getFile.filter(o => o.toLocaleLowerCase().includes(args.searchParams.get('search').toLocaleLowerCase()));
            }
        }

        if (['array', 'list'].includes(args.searchParams.get('type'))) {
            if (file != null) {
                file = file;
            } else {
                file = getFile;
            }
        }
    } else {
        file = getFile[Math.floor(Math.random() * getFile.length)];

        if (file === 'folder.json') {
            file = 'rest_here.mp4';
        }
    }


    if (Array.isArray(file) && file.length === 0) {
        res.statusCode = 400;
        return res.end();
    } else if (file === null || file === undefined) {
        res.statusCode = 400;
        return res.end();

    // If 'type' parameter is not set to 'array' or 'list' and 'file' is an array, select a random file from the array
    } else if (!['array', 'list'].includes(args.searchParams.get('type')) && Array.isArray(file)) {
        file = file[Math.floor(Math.random() * file.length)];

    // If 'type' parameter is set to 'array' or 'list' and 'file' is not an array, convert 'file' to an array
    } else if (['array', 'list'].includes(args.searchParams.get('type')) && !Array.isArray(file)) {
        file = [file];
    }

    let createURLS = [];

    if (Array.isArray(file)) {
        for (let i = 0; i < file.length; i++) {
            if (file[i] === undefined) break;

            createURLS.push(`https://memes.eylexander.xyz/${file[i]}`);
        }

    } else {
        createURLS = `https://memes.eylexander.xyz/${file}`;
    }

    const response = {
        name: file,
        url: createURLS
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));

    // Cache the response
    cache[cacheKey] = {
        data: response,
        time: Date.now()
    };
}

const server = http.createServer(requestListener);

server.on('request', (req, res) => {
    log('Request for ' + req.url + ' by method ' + req.method + ' on status ' + res.statusCode);
});


server.listen(port, () => {
    log(`Server running at http://${server.address().address}:${server.address().port}/`);
});