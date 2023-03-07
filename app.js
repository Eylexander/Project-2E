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

    const args = new URL(req.url, `https://${req.headers.host}`);

    let file = null;
    if (args.searchParams) {
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

            default:
                return res.end(JSON.stringify({ error: 'Invalid query' }));
                break;

        }
        if (args.searchParams.get('search')) {
            if (file != null) {
                file = file.filter(o => o.includes(args.searchParams.get('search')));
            } else {
                file = getFile.filter(o => o.includes(args.searchParams.get('search')));
            }
        }
    } else {
        file = getFile[Math.floor(Math.random() * getFile.length)];

        if (file === 'folder.json') {
            file = 'rest_here.mp4';
        }
    }

    if (file == null) {
        return res.end(JSON.stringify({ error: 'Invalid query' }));
    }

    const response = {
        name: file,
        url: `https://eylexander.xyz/memes/${file}`
    };

    // res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
}

const server = http.createServer(requestListener);

server.listen(port, () => {
    log(`Server running on port : ${port}`);
});