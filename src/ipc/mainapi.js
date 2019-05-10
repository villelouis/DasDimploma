import promiseIpc from 'electron-promise-ipc';

// При вызове функции передавать функции аргументы используя средства es6 :
// [обяз_арг1, .... , обяз_аргN, {арг1:арг1, .... , аргN:аргN}]

function ipcDecorator(channel) {
    return function (arg) {
        // получаем Промис, значение или "OK" в случае undefined
        return promiseIpc.send(channel, arg)
    }
}

const ipc_getFullTablePath = ipcDecorator("getFullTablePath")
// getFullTablePath(tableName))

const ipc_asyncSetCurrentTable = ipcDecorator("asyncSetCurrentTable")
// asyncSetCurrentTable(tableName, {caption, user} = {}))

const ipc_getCurrentTable = ipcDecorator("getCurrentTable")
//getCurrentTable()

const ipc_asyncGetAllTablesOfUser = ipcDecorator("asyncGetAllTablesOfUser")
//asyncGetAllTablesOfUser(user = undefined)

const ipc_asyncGetAllTables = ipcDecorator("asyncGetAllTables")
//asyncGetAllTables()

const ipc_asyncRemoveTable = ipcDecorator("asyncRemoveTable")
//asyncRemoveTable({tableName, user} = {})

const ipc_asyncAddRecord = ipcDecorator("asyncAddRecord")
//asyncAddRecord(itemId, columnValuesDict)

const ipc_asyncGetRecord = ipcDecorator("asyncGetRecord")
//asyncGetRecord(itemId)

const ipc_asyncGetAllRecords = ipcDecorator("asyncGetAllRecords")
//asyncGetAllRecords()

const ipc_asyncRemoveRecord = ipcDecorator("asyncRemoveRecord")
//asyncRemoveRecord(itemId)

const ipc_asyncUpdateRecord = ipcDecorator("asyncUpdateRecord")
//asyncUpdateRecord(itemId, updateColumnsDict)

const ipc_getCurrentUser = ipcDecorator("getCurrentUser")
//getCurrentUser()

const ipc_setCurrentUser = ipcDecorator("setCurrentUser")
//setCurrentUser(newUser)


export default {
        getFullTablePath: ipc_getFullTablePath,
        asyncSetCurrentTable: ipc_asyncSetCurrentTable,
        getCurrentTable: ipc_getCurrentTable,
        asyncGetAllTablesOfUser: ipc_asyncGetAllTablesOfUser,
        asyncGetAllTables: ipc_asyncGetAllTables,
        asyncRemoveTable: ipc_asyncRemoveTable,
        asyncAddRecord: ipc_asyncAddRecord,
        asyncGetRecord: ipc_asyncGetRecord,
        asyncGetAllRecords: ipc_asyncGetAllRecords,
        asyncRemoveRecord: ipc_asyncRemoveRecord,
        asyncUpdateRecord: ipc_asyncUpdateRecord,
        getCurrentUser: ipc_getCurrentUser,
        setCurrentUse: ipc_setCurrentUser
}


/* ТЕСТЫ
function test2(callback) {
    // тест вызова асинхронной функции
    promiseIpc
        .send('asyncGetAllTables', [])
        .then(callback)
        .catch((e) => console.error(e));
}
function myf(doc){
    console.log(doc)
}
// test2(myf)

function test1() {
    // тест вызова синхронной функции
    promiseIpc
        .send('getCurrentUser', [])
        .then(user=>{console.log(user)})
        .catch((e) => console.error(e));
}


import console from 'console'
function test3() {
    const test_ipc = ipcDecorator("asyncGetAllTables")
    test_ipc([]).then((doc)=>{
        console.log(doc)
    })
}
test3()

 */