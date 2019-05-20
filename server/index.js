/* eslint-disable no-console */
const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8080;
const idRegExp = /\d{1,}\.\d{1,}\.\d{1,}\.\d{1,}:\d{4,}/;

const connectionList = [];

const command = {
  '/list': connectionList
    .map(elem => elem.address)
    .toString(),
  '/end': '/end',
  '/startMessage': 'enter address',
};
command['/help'] = `${Object.keys(command)}`;

function updateData() {
  command['/list'] = connectionList
    .map(elem => elem.address)
    .toString();
}

const server = net.createServer((client) => {
  console.log(`CONNECTED: ${client.remoteAddress}:${client.remotePort}`);

  connectionList.push({
    address: `${client.remoteAddress}:${client.remotePort}`,
    client,
  });

  let interlocutor = client;
  updateData();

  client.on('data', (data) => {
    const message = data.toString().replace(/\s/g, '');
    if (message.match(idRegExp)) {
      const index = connectionList.findIndex(elem => elem.address === message);

      if (index >= 0) {
        interlocutor = connectionList[index].client;
      }
      return;
    }

    if (interlocutor !== client) {
      interlocutor.write(`${new Date()}::${client.remoteAddress}:${client.remotePort}:  ${message}`);
      return;
    }
    const result = command[message] || 'incorrect input';
    interlocutor.write(result);

    if (result === '/end') {
      connectionList.slice(connectionList);
      server.close();
    }
  });
});

server.listen(PORT, HOST);
