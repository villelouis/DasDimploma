'use strict'
/*
const Store = require('nedb');


// Системные
const path = require('path');
const console = require('console');
const fs = require('fs');

const DB_settings = require('./db_settings');
// путь к папке с файлами баз данных:
const path_to_dbs = path.join(__dirname, DB_settings.path_to_db);

// const remote = require('electron').remote;
// const app = remote.app;
// const path_to_dbs = path.join(app.getPath('userData'), DB_settings.path_to_db);
console.log("Путь до файлов Базы данных : ",path_to_dbs);
const METATABLE_name = DB_settings.meta_table_name;
 // */

// ================ ES6 ИМПОРТЫ : =======================
// /*
// Cистемные:
import path from 'path'
import fs from 'fs'
import console from 'console'

import Store from 'nedb';

// Настройки приложения :
import DB_settings from './db_settings';

// const remote = require('electron').remote;
// const app = remote.app;
// const path_to_dbs = path.join(app.getPath('userData'), DB_settings.path_to_db);
const path_to_dbs = path.join(__dirname, DB_settings.path_to_db);
//for test:
// const path_to_dbs = path.join("/home/ubuntu", DB_settings.path_to_db);
//

const defaultUser = DB_settings.user;
const defaultTableName = DB_settings.defaultTableName;

const METATABLE_name = DB_settings.meta_table_name;
console.log("Путь до файлов Базы данных : ",path_to_dbs);
// */

class TableManager {
    /*
    Методы для управления файлами таблиц
     */
    constructor({tableName,user,caption} = {}) {
        tableName = tableName === undefined ? defaultTableName:tableName;
        user = user === undefined ? defaultUser:user;
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

//=============================ЗАПУСК===========================================
// Вариант для теста:
// exports.TableManager = TableManager;
// Вариант для работы:
export default TableManager
//==============================================================================