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

    if (req.url.startsWith('/?get=')) {

        res.writeHead(200, { 'Content-Type': 'application/json' });
        switch (req.url.split('?get=')[1]) {
            case 'jpg':
                const jpg = getFile.filter(o => o.endsWith('.jpg'));
                let getRandomJPG = jpg[Math.floor(Math.random() * jpg.length)];

                const responseJPG = {
                    name: getRandomJPG,
                    url: `https://eylexander.xyz/memes/${getRandomJPG}`
                };

                res.end(JSON.stringify(responseJPG));
                break;

            case 'png':
                const png = getFile.filter(o => o.endsWith('.png'));
                let getRandomPNG = png[Math.floor(Math.random() * png.length)];

                const responsePNG = {
                    name: getRandomPNG,
                    url: `https://eylexander.xyz/memes/${getRandomPNG}`
                };

                res.end(JSON.stringify(responsePNG));
                break;

            case 'jpeg':
                const jpeg = getFile.filter(o => o.endsWith('.jpeg'));
                let getRandomJPEG = jpeg[Math.floor(Math.random() * jpeg.length)];

                const responseJPEG = {
                    name: getRandomJPEG,
                    url: `https://eylexander.xyz/memes/${getRandomJPEG}`
                };

                res.end(JSON.stringify(responseJPEG));
                break;

            case 'gif':
                const gif = getFile.filter(o => o.endsWith('.gif'));
                let getRandomGIF = gif[Math.floor(Math.random() * gif.length)];

                const responseGIF = {
                    name: getRandomGIF,
                    url: `https://eylexander.xyz/memes/${getRandomGIF}`
                };

                res.end(JSON.stringify(responseGIF));
                break;

            case 'webp':
                const webp = getFile.filter(o => o.endsWith('.webp'));
                let getRandomWEBP = webp[Math.floor(Math.random() * webp.length)];

                const responseWEBP = {
                    name: getRandomWEBP,
                    url: `https://eylexander.xyz/memes/${getRandomWEBP}`
                };

                res.end(JSON.stringify(responseWEBP));
                break;

            case 'mp4':
                const mp4 = getFile.filter(o => o.endsWith('.mp4'));
                let getRandomMP4 = mp4[Math.floor(Math.random() * mp4.length)];

                const responseMP4 = {
                    name: getRandomMP4,
                    url: `https://eylexander.xyz/memes/${getRandomMP4}`
                };

                res.end(JSON.stringify(responseMP4));
                break;

            case 'webm':
                const webm = getFile.filter(o => o.endsWith('.webm'));
                let getRandomWEBM = webm[Math.floor(Math.random() * webm.length)];

                const responseWEBM = {
                    name: getRandomWEBM,
                    url: `https://eylexander.xyz/memes/${getRandomWEBM}`
                };

                res.end(JSON.stringify(responseWEBM));
                break;

            case 'mov':
                const mov = getFile.filter(o => o.endsWith('.mov'));
                let getRandomMOV = mov[Math.floor(Math.random() * mov.length)];

                const responseMOV = {
                    name: getRandomMOV,
                    url: `https://eylexander.xyz/memes/${getRandomMOV}`
                };

                res.end(JSON.stringify(responseMOV));
                break;

            case 'image':
                const image = getFile.filter(o => o.endsWith('.jpg') || o.endsWith('.png') || o.endsWith('.jpeg') || o.endsWith('.gif') || o.endsWith('.webp'));
                let getRandomImage = image[Math.floor(Math.random() * image.length)];

                const responseImage = {
                    name: getRandomImage,
                    url: `https://eylexander.xyz/memes/${getRandomImage}`
                };

                res.end(JSON.stringify(responseImage));
                break;

            case 'video':
                const video = getFile.filter(o => o.endsWith('.mp4') || o.endsWith('.webm') || o.endsWith('.mov'));
                let getRandomVideo = video[Math.floor(Math.random() * video.length)];

                const responseVideo = {
                    name: getRandomVideo,
                    url: `https://eylexander.xyz/memes/${getRandomVideo}`
                };

                res.end(JSON.stringify(responseVideo));
                break;

            default:
                res.end(JSON.stringify({ error: 'Invalid query' }));
                break;
        }
    } else {
        const getRandomMeme = getFile[Math.floor(Math.random() * getFile.length)];

        if (getRandomMeme === 'folder.json') {
            getRandomMeme = 'rest_here.mp4';
        }
    
        const response = {
            name: getRandomMeme,
            url: `https://eylexander.xyz/memes/${getRandomMeme}`
        };
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }
}

const server = http.createServer(requestListener);

server.listen(port, () => {
    log(`Server running on port : ${port}`);
});