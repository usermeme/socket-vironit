const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8080;

const connectionList = [];
const arrClient = []

const command = {
  list: connectionList.toString(),
  end: 'end',
  hello: 'world',
  startmessage: 'enter address',
};
command.help = `${Object.keys(command)}`;

const updateData = () => {
  command.list = connectionList.toString();
};

const idRegExp = /\d{1,}\.\d{1,}\.\d{1,}\.\d{1,}:\d{4,}/;

const server = net.createServer((client) => {
  console.log(`CONNECTED: ${client.remoteAddress}:${client.remotePort}`);

  connectionList.push(`${client.remoteAddress}:${client.remotePort}`);
  arrClient.push(client);
  updateData();

  client.on('data', (data) => {
    if (data.toString().match(idRegExp)) {
      
    }
    const result = command[data.toString()] || 'incorrect input';
    client.write(result);

    server.close();
  });
});

server.listen(PORT, HOST);
