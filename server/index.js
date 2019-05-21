/* eslint-disable no-console */
const net = require('net');
const Commands = require('./Commands/Commands');

const HOST = '127.0.0.1';
const PORT = 8080;

const connectionList = [];

const server = net.createServer((client) => {
  console.log(`CONNECTED: ${client.remoteAddress}:${client.remotePort}`);

  connectionList.push({
    address: `${client.remoteAddress}:${client.remotePort}`,
    client,
  });

  let interlocutor = client;

  client.on('data', (data) => {
    const message = data.toString();

    if (message.search(/^\//g) !== -1) { // if we write a command
      const command = Commands.getCommand(message)[0];
      const address = Commands.getCommand(message)[1];

      if (Commands[command]) {
        interlocutor = Commands[command](connectionList, server, client, address) || client;
      }
      return;
    }


    if (interlocutor !== client) {
      interlocutor.write(`${new Date()}::${client.remoteAddress}:${client.remotePort}:  ${message}`);
    }
  });
});

server.listen(PORT, HOST);
