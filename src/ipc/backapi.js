import promiseIpc from 'electron-promise-ipc';
promiseIpc.on('GETAAA', (arg) => {
    return db.asyncGetAllTables(arg)
});

import TableManager from '../database/TableManager'
const db = new TableManager();


promiseIpc.on('getCurrentUser', (arg) => {
    return db.getCurrentUser(...arg)
});

promiseIpc.on('setCurrentUser', (arg) => {
    return db.setCurrentUser(...arg)
});


promiseIpc.on('getFullTablePath', (arg) => {
    return db.getFullTablePath(...arg)
});
// const ipc_getFullTablePath = ipcDecorator(db.getFullTablePath,"getFullTablePath")

promiseIpc.on('asyncSetCurrentTable', (arg) => {
    return db.asyncSetCurrentTable(...arg)
});
// const ipc_asyncSetCurrentTable = ipcDecorator(db.asyncSetCurrentTable,"asyncSetCurrentTable")

promiseIpc.on('getCurrentTable', (arg) => {
    return db.getCurrentTable(...arg)
});
// const ipc_getCurrentTable = ipcDecorator(db.getCurrentTable,"getCurrentTable")

promiseIpc.on('asyncGetAllTablesOfUser', (arg) => {
    return db.asyncGetAllTablesOfUser(...arg)
});
// const ipc_asyncGetAllTablesOfUser = ipcDecorator(db.asyncGetAllTablesOfUser,"asyncGetAllTablesOfUser")

promiseIpc.on('asyncGetAllTables', (arg) => {
    return db.asyncGetAllTables(...arg)
});
// const ipc_asyncGetAllTables = ipcDecorator(db.asyncGetAllTables,"asyncGetAllTables")

promiseIpc.on('asyncRemoveTable', (arg) => {
    return db.asyncRemoveTable(...arg)
});
// const ipc_asyncRemoveTable = ipcDecorator(db.asyncRemoveTable,"asyncRemoveTable")

promiseIpc.on('asyncAddRecord', (arg) => {
    return db.asyncAddRecord(...arg)
});
// const ipc_asyncAddRecord = ipcDecorator(db.asyncAddRecord,"asyncAddRecord")

promiseIpc.on('asyncGetRecord', (arg) => {
    return db.asyncGetRecord(...arg)
});
// const ipc_asyncGetRecord = ipcDecorator(db.asyncGetRecord,"asyncGetRecord")

promiseIpc.on('asyncGetAllRecords', (arg) => {
    return db.asyncGetAllRecords(...arg)
});
// const ipc_asyncGetAllRecords = ipcDecorator(db.asyncGetAllRecords,"asyncGetAllRecords")

promiseIpc.on('asyncRemoveRecord', (arg) => {
    return db.asyncRemoveRecord(...arg)
});
// const ipc_asyncRemoveRecord = ipcDecorator(db.asyncRemoveRecord,"asyncRemoveRecord")

promiseIpc.on('asyncUpdateRecord', (arg) => {
    return db.asyncUpdateRecord(...arg)
});


