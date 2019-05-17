const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8080;

const answer = {
	hello: 'world',
	end: 'end',
};

const server = net.createServer((client) => {
  console.log(`CONNECTED: ${client.remoteAddress}:${client.remotePort}`);

  client.on('data', (data) => {
    const result = answer[data.toString()] || 'incorrect input';
    client.write(result);
  });
});
server.listen(PORT, HOST);
