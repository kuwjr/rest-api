const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');


//Instantiating the HTTP server
let httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

//start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log("Server listening on port: " + config.httpPort);
});

//Instantiating the HTTPS server
let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
let httpsServer = http.createServer(httpsServerOptions,(req, res) => {
    unifiedServer(req, res);
});

//start the HTTPs server
httpsServer.listen(config.httpsPort, () => {
    console.log("Server listening on port: " + config.httpsPort);
});

//all the server logic for both the http and https server 
let unifiedServer = (req, res) => {

    //get the URL and parse it
    parsedUrl = url.parse(req.url, true);

    //get the path from the parsed URL
    path = parsedUrl.pathname;

    //get trimmed path
    trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //get query string as an object
    queryStringObject = parsedUrl.query;

    //get the headers from the request
    headers = req.headers;

    //get the method of the http request
    method = req.method.toLowerCase();

    //get the payload if any
    decoder = new StringDecoder('utf-8');
    buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        //choose the handler this request should go to, if not found choose the notFound handler
        chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct the data object to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer),
        };

        //route the request to the handler specified in the handler
        chosenHandler(data, (statusCode, payload) => {
            //use the  status code called back by the handler, or default  to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            //use the payload called back by the handler or return an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            //convert the payload to a string (Handler is sending back to the user)
            let payLoadString = JSON.stringify(payload);

            //send a response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payLoadString);

            //log the request path
            console.log("Response: ", statusCode, payLoadString);

        })
    });

}

//defining a request router
let router = {
    'ping' : handlers.ping,
    'users': handlers.users,
}