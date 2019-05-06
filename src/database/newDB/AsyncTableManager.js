const Store = require('nedb');

// Системные
const path = require('path');
const console = require('console');
const fs = require('fs');

const DB_settings = require('../db_settings');
// путь к папке с файлами баз данных:
const path_to_dbs = path.join(__dirname, DB_settings.path_to_db);
const METATABLE_name = DB_settings.meta_table_name;

class TableManager {
    /*
    Методы для управления файлами таблиц
     */
    constructor(tableName, user, {caption} = {}) {
        this.user = user;
        this.currentTable = tableName;
        this.METATABLE = this.loadTable(METATABLE_name);
        if (!this.tableExists(tableName)) {
            this.addTableToMETATABLE(tableName, {caption: caption, user: user});
        }
        this.db = this.loadTable(tableName);
    }

    // +
    getFullTablePath(tableName) {
        return path.join(path_to_dbs, tableName);
    }

    // +
    tableExists(tableName) {
        let fullFileName = this.getFullTablePath(tableName);
        return fs.existsSync(fullFileName);
    }

    // может использоваться, как для загрузки таблиц,так и для создания
    loadTable(tableName) {
        return new Store({
            filename: this.getFullTablePath(tableName),
            autoload: true
        });
    }

    // +
    setCurrentTable(tableName, {caption, user, callback} = {}) {
        if (!this.tableExists(tableName)) {
            this.addTableToMETATABLE(tableName, {caption: caption, user: user, callback: callback})
        }
        this.currentTable = tableName;
        this.db = this.loadTable(tableName);
    }

    // +
    getAllTablesOfUser({callback, user} = {}) {
        user = user === undefined ? this.user : user;
        return this.METATABLE.find({user: user}, callback)
    }

//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================

    asyncSetCurrentTable(tableName, {caption, user} = {}) {
        let self = this;
        return new Promise(function (resolve) {
            self.currentTable = tableName;
            self.db = self.loadTable(tableName);
            if (!self.tableExists(tableName)) {
                self.asyncAddTableToMETATABLE(tableName, {caption: caption, user: user}).then(
                    () => {
                        resolve();
                    }
                );
            }
        });
    }

    getCurrentTable() {
        return this.currentTable;
    }

    asyncGetAllTablesOfUser(user = undefined) {
        let self = this;
        return new Promise(function (resolve, reject) {
            user = user === undefined ? self.user : user;
            return self.METATABLE.find({user: user}, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
        /* пример использования:
            asyncGetAllTablesOfUser().then(function (doc) {
                console.log(doc)
            });
        */
    }

    asyncGetAllTables() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.METATABLE.find({}, function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    /*
    Методы для работы с МЕТАТАБЛИЦЕЙ
    */
    asyncAddTableToMETATABLE(tableName, {caption, user} = {}) {
        let self = this;
        return new Promise(function (resolve, reject) {
            user = user === undefined ? self.user : user;
            caption = caption === undefined ? tableName : caption;
            let doc = {
                _id: `${user}@${tableName}`,
                user: user,
                table: tableName,
                caption: caption
            };
            self.METATABLE.insert(doc, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    asyncRemoveTable({tableName, user} = {}) {
        let self = this;
        return new Promise(function (resolve) {
            tableName = tableName === undefined ? self.currentTable : tableName;
            self.asyncRemoveTableFromMETATABLE(tableName, {user: user}).then(
                () => {
                    resolve()
                }
            );
            fs.unlink(self.getFullTablePath(tableName), (err) => {
                if (err) throw err;
                console.log(`${tableName} was deleted`);
            });
            self.currentTable = self.currentTable === tableName ? undefined : self.currentTable;
        });
    }

    asyncRemoveTableFromMETATABLE(tableName, {user} = {}) {
        let self = this;
        return new Promise(function (resolve, reject) {
            user = user === undefined ? self.user : user;
            console.log("remove for USER ==================>", user, tableName);
            self.METATABLE.remove({_id: `${user}@${tableName}`}, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        })
    }

    /*
   Методы для управлением содержимым таблицы
    */
    asyncAddRecord(itemId, columnValuesDict) {
        // item - уникальное наименование товара
        let self = this;
        return new Promise(function (resolve, reject) {
            let item = {
                _id: `${itemId}`,
            };
            self.db.insert(Object.assign(item, columnValuesDict), (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    asyncGetRecord(itemId) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.findOne({_id: itemId}, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    asyncGetAllRecords() {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.find({}, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    asyncRemoveRecord(itemId) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.remove({_id: itemId}, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    asyncUpdateRecord(itemId, updateColumnsDict) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let item = {
                _id: `${itemId}`,
            };
            self.db.update(item, {$set: updateColumnsDict}, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
//==================================================================================================================================
    //    +
    getAllTables(callback) {
        this.METATABLE.find({}, callback)
    }

    removeTable({tableName, callback} = {}) {
        tableName = tableName === undefined ? this.currentTable : tableName;
        this.removeTableFromMETATABLE(tableName, {callback: callback});
        fs.unlink(this.getFullTablePath(tableName), (err) => {
            if (err) throw err;
            console.log(`${tableName} was deleted`);
        });
        this.currentTable = this.currentTable === tableName ? undefined : this.currentTable;
    }

    renameTable(newName, {tableName} = {}) {
        tableName = tableName === undefined ? this.currentTable : tableName;

        this.METATABLE.findOne({_id: `${this.user}@${tableName}`}, function (record) {
            record.table = newName;
            this.METATABLE.insert(record);
            this.METATABLE.remove({_id: `${this.user}@${tableName}`});
        });

        fs.rename(this.getFullTablePath(tableName), this.getFullTablePath(newName),
            function (err) {
                if (err) console.log('Ошибка во время попытки переименовать таблицу: ' + err);
            });
        this.currentTable = newName;
    }

    /*
   Методы для работы с МЕТАТАБЛИЦЕЙ
    */

    // +
    addTableToMETATABLE(tableName, {caption, user, callback} = {}) {
        user = user === undefined ? this.user : user;
        caption = caption === undefined ? tableName : caption;
        let doc = {
            _id: `${user}@${tableName}`,
            user: user,
            table: tableName,
            caption: caption
        };
        this.METATABLE.insert(doc, callback);
    }

    // +
    removeTableFromMETATABLE(tableName, {callback, user} = {}) {
        user = user === undefined ? this.user : user;
        console.log("remove for USER ==================>", user, tableName);
        this.METATABLE.remove({_id: `${user}@${tableName}`}, callback);
    }

    /*
    Методы для работы с пользователями
     */
    getCurrentUser() {
        return this.user;
    }

    setCurrentUser(newUser) {
        this.user = newUser;
    }

    /*
    Методы для управлением содержимым таблицы
     */

    // $
    addRecord(item, columnValuesDict) {
        this.db.insert(Object.assign(item, columnValuesDict));
    }

}

function asyncTestWorkWithMETATABLE() {
    let db = new TableManager("Bananas", "Max");

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
    let db = new TableManager("Bananas", "Max");
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
