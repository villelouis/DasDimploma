const moduleq = require('./TableManager');
// import TableManager from 'TableManager'
const console = require('console');
// import console from 'console'

function asyncTestWorkWithMETATABLE() {
    let db = new moduleq.TableManager("Bananas", "Max");

    function ilog(i) {
        console.log(`=====================${i}===========================`);
    }

    function createTestMetaTableList(db) {
        db.asyncAddTableToMETATABLE("A", {user: 'Mariya'})
            .then(db.asyncAddTableToMETATABLE("B", {user: 'Mariya'}))
            .then(db.asyncAddTableToMETATABLE("C", {user: 'Mariya'}))
            .then(db.asyncAddTableToMETATABLE("D", {user: 'Mariya'}))
            .then(db.asyncAddTableToMETATABLE("E"))
            .then(db.asyncAddTableToMETATABLE("F"))
            .then(db.asyncAddTableToMETATABLE("G"))
            .then(db.asyncAddTableToMETATABLE("H"))
            .then(db.asyncAddTableToMETATABLE("I"))
            .then(db.asyncAddTableToMETATABLE("L"))
            .then(db.asyncAddTableToMETATABLE("1"))
            .then(db.asyncAddTableToMETATABLE("2"))
            .then(db.asyncAddTableToMETATABLE("3"))
            .then(db.asyncAddTableToMETATABLE("4", {user: 'Dmitry'}))
            .then(db.asyncAddTableToMETATABLE("5"))
            .then(db.asyncAddTableToMETATABLE("6"))
            .then(db.asyncAddTableToMETATABLE("7"))
            .then(db.asyncAddTableToMETATABLE("8"));
    }

    createTestMetaTableList(db);
    db.asyncGetAllTablesOfUser().then(function (doc) {
        ilog(1);
        console.log("Получение данных пользователя по умолчанию");
        console.log(doc)
    });
    db.asyncGetAllTablesOfUser('Dmitry').then(function (doc) {
        ilog(2);
        console.log("Получение данных пользователя Dmitry");
        console.log(doc)
    });
    db.asyncGetAllTablesOfUser('Mariya').then(function (doc) {
        ilog(3);
        console.log("Получение данных пользователя Mariya");
        console.log(doc)
    });
    db.asyncSetCurrentTable("MyBrain").then(function () {
        console.log(`Текущая таблица ${db.getCurrentTable()} и пользователь ${db.getCurrentUser()}`);
    }).then(function () {
        db.asyncSetCurrentTable("OlalaAAAAAA");
    }).then(function () {
        db.asyncGetAllTables().then((doc) => {
            ilog(4);
            console.log("До удаления ", doc)
        })
    }).then(function () {
        db.asyncRemoveTable({tableName: "MyBrain"})
    }).then(function () {
        db.asyncGetAllTables().then((doc) => {
            console.log("После удаления ", doc)
        })
    })
}
function asyncTestWorkWithRecords() {
    let db = new moduleq.TableManager("Bananas", "Max");
    function testForOneTable(db){
        return new Promise(function (resolve) {
            db.asyncAddRecord("Сирийский", {Color: "Жёлтый", Smell: "Приятный", Price: 10}).then(function () {
                db.asyncAddRecord("Манджурский", {Color: "Светло-жёлтый", Smell: "Остутс", Price: 2});
            }).then(function () {
                db.asyncGetAllRecords().then(function (doc) {
                    console.log("==========ПОСЛЕ ДОБАВЛЕНИЯ==========");
                    console.log(doc);
                });
            }).then(function () {
                db.asyncUpdateRecord('Манджурский',{Smell:"Ароматный!"}).then(
                    function () {
                        console.log("==========ПОСЛЕ ИЗМЕНЕНИЯ==========");
                        db.asyncGetAllRecords().then(function (doc) {
                            console.log(doc);
                        });
                    }).then(function () {
                    db.asyncRemoveRecord('Сирийский');
                }).then(function () {
                    db.asyncGetAllRecords().then(function (doc) {
                        console.log("===========ПОСЛЕ УДАЛЕНИЯ===============");
                        console.log(doc);
                    }).then(function () {
                        resolve();
                    });
                })
            })
        })
    }

    testForOneTable(db).then(function () {
        db.asyncSetCurrentTable('OlalaAAAAAA');
    }).then(function () {
        testForOneTable(db).then();
    })
}

// asyncTestWorkWithMETATABLE();
asyncTestWorkWithRecords();