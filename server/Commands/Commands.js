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
    connectionList.slice(connectionList.findIndex(elem => elem.client === client), 1);
    server.close();
  }

  static '/help'(...args) {
    const client = args[2];

    client.write(`
    /list - clients addresses,
    /exit - exit,
    /call - start chat
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

    const index = connectionList.findIndex(elem => elem.address === address);
    const interlocutor = connectionList[index].client;

    interlocutor.write(`${client.remoteAddress}:${client.remotePort} start chat (yes/no)`);
    return interlocutor;
  }

  static getCommand(message) {
    return message
      .replace(/\s{1,}/g, ' ')
      .split(' ');
  }
}

module.exports = Commands;
