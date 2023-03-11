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

    const { data } = await axios.get('https://eylexander.xyz/Collection/memes/folder.json');

    const contents = data.map(o => o.contents);
    const getFile = contents[0].filter(o => o.type === 'file').map(o => o.name);

    const args = new URL(req.url, `https://${req.headers.host}`);

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
        return res.end(JSON.stringify({ error: 'Invalid query' }));
    } else if (file === null || file === undefined) {
        return res.end(JSON.stringify({ error: 'Invalid query' }));
    } else if (!['array', 'list'].includes(args.searchParams.get('type')) && Array.isArray(file)) {
        file = file[Math.floor(Math.random() * file.length)];
    } else if (['array', 'list'].includes(args.searchParams.get('type')) && !Array.isArray(file)) {
        file = [file];
    }

    let createURLS = [];

    if (Array.isArray(file)) {
        // for (let i = 0; i < file.length > 99 ? 100 : file.length; i++) {
        for (let i = 0; i < file.length; i++) {
            if (file[i] === undefined) break;

            createURLS.push(`https://eylexander.xyz/Collection/memes/${file[i]}`);
        }

        // Cut the array to 100 files
        // if (file.length > 100) file = file.slice(0, 100);

    } else {
        createURLS = `https://eylexander.xyz/Collection/memes/${file}`;
    }

    const response = {
        name: file,
        url: createURLS
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
}

const server = http.createServer(requestListener);

server.listen(port, () => {
    log(`Server running on port : ${port}`);
});