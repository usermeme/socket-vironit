/* eslint-disable no-console */
const http = require('http');

const HOST = '127.0.0.1';
const PORT = 8080;

const answer = {
  '/': 'hello world',
  '/hello': 'world',
};

const server = http.createServer((request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8;');
  if (answer[request.url]) {
    response.write(answer[request.url]);
  } else {
    response.write('404');
  }
  response.end();
});

server.listen(PORT, HOST, (err) => {
  if (err) {
    console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`);
});
