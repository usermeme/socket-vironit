/* eslint-disable no-console */
/* eslint-disable no-cond-assign */
const net = require('net');
const process = require('process');

const HOST = '127.0.0.1';
const PORT = 8080;

const client = net.createConnection({ port: PORT, host: HOST }, () => {
  console.log(`CONNECTED TO: ${HOST}:${PORT}`);
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    let chunk;
    let str = '';
    while ((chunk = process.stdin.read()) !== null) {
      str += chunk;
    }
    client.write(str);
  });
});

client.on('data', (data) => {
  if (data.toString() === '/exit') {
    client.end();
    return;
  }
  console.log(data.toString());
});

client.on('end', () => {
  console.log('disconnected from server');
  process.exit();
});
