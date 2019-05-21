class Commands {
  static '/list'(...args) {
    const connectionList = args[0];
    const client = args[2];

    const addresses = connectionList
      .filter(elem => elem.client !== client)
      .map(elem => elem.address)
      .toString();

    client.write(addresses);
  }

  static '/exit'(...args) {
    const connectionList = args[0];
    const server = args[1];
    const client = args[2];

    client.write('/exit');
    connectionList.splice(connectionList.findIndex(elem => elem.client === client), 1);
    server.close();
  }

  static '/help'(...args) {
    const client = args[2];

    client.write(`
    /list - clients address,
    /exit - exit,
    /call [address] - start chat
    `);
  }

  static '/call'(...args) {
    const connectionList = args[0];
    const client = args[2];
    const address = args[3];

    const idRegExp = /\d{1,}\.\d{1,}\.\d{1,}\.\d{1,}:\d{4,}$/;

    if (address.search(idRegExp) === -1) {
      client.write('incorrect address');
      return false;
    }

    const interlocutor = Commands.findInterlocutor(connectionList, address);
    const selfAddress = `${client.remoteAddress}:${client.remotePort}`;

    client.write(`chat started with ${address}`);

    interlocutor.write(`
    ${selfAddress} started chatting with you,
    /call ${selfAddress} for answer
    `);

    return interlocutor;
  }

  static findInterlocutor(connectionList, address) {
    const index = connectionList.findIndex(elem => elem.address === address);
    return connectionList[index].client;
  }

  static getCommand(message) {
    return message
      .replace(/\s{1,}/g, ' ')
      .split(' ');
  }

  static showConnect(connectionList, client) {
    const clients = connectionList
      .filter(elem => elem.client !== client)
      .map(elem => elem.client);

    if (!clients.length) {
      return;
    }
    
    clients.forEach((element) => {
      element.write(`${client.remoteAddress}:${client.remotePort} connected`);
    });
  }
}

module.exports = Commands;
