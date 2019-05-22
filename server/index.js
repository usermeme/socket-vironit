/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const net = require('net');
const Commands = require('./Commands/Commands');

const connectionList = [];

const server = net.createServer((client) => {
  connectionList.push({
    address: `${client.remoteAddress}:${client.remotePort}`,
    client,
  });

  Commands.showConnect(connectionList, client);

  let interlocutor = client;

  client.on('data', (data) => {
    const message = data.toString().slice(0, -1);

    if (message.search(/^\//g) !== -1) { // if we write a command
      const command = Commands.getCommand(message)[0];
      const address = Commands.getCommand(message)[1];

      if (Commands[command]) {
        interlocutor = Commands[command](connectionList, server, client, address) || client;
      }
      return;
    }

    if (interlocutor !== client) {
      const date = new Date();
      const dateString = `${date.getFullYear()}.${date.getMonth()}.${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

      interlocutor.write(`${client.remoteAddress}:${client.remotePort} ${dateString}:  ${message}`);
    }
  });
});

server.listen(process.env.PORT, process.env.HOST);
