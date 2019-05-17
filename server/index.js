const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8080;

const answer = {
  list: [],
  end: 'end',
  hello: 'world',
  help: Object.keys(this),
  start_message: 'enter address',
};

const server = net.createServer((client) => {
  console.log(`CONNECTED: ${client.remoteAddress}:${client.remotePort}`);

  answer.list.push(`${client.remoteAddress}:${client.remotePort}`);
  client.on('data', (data) => {
    const result = `${answer[data.toString()]}` || 'incorrect input';
    client.write(result);

    server.close();
  });
});

server.listen(PORT, HOST);
