const console = require('console');
import TableManager from '../database/TableManager'
const db = new TableManager();

const { ipcMain } = require('electron');
ipcMain.on('synchronous-message', (event, arg) => {
    console.log(arg) ;// prints "ping"
    event.returnValue = 'pong'
});

