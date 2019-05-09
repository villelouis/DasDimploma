const { ipcRenderer } = require('electron');
const console = require('console');
console.log(ipcRenderer.sendSync('synchronous-message', 'ping'));// prints "pong"