'use strict'

// Cистемные:
import path from 'path'
import fs from 'fs'
import console from 'console'

import Store from 'nedb';

// Настройки приложения :
import DB_settings from './db_settings';

const electron = require('electron');
const app = electron.app;
const path_to_dbs = path.join(app.getPath('userData'), DB_settings.path_to_db);
console.log("Путь до файлов Базы данных : ",path_to_dbs);

const defaultUser = DB_settings.user;
const defaultTableName = DB_settings.defaultTableName;

const METATABLE_name = DB_settings.meta_table_name;


class TableManager {
    /*
    Методы для управления файлами таблиц
     */
    constructor({tableName,user,caption} = {}) {
        this.user = user === undefined ? defaultUser:user;
        this.currentTable = tableName === undefined ? defaultTableName:tableName;
        this.caption = caption === undefined ? this.currentTable : caption;
        this.METATABLE = this.loadTable(METATABLE_name);
        if (!this.tableExists(this.currentTable)) {
            this.addTableToMETATABLE(this.currentTable, {caption: caption, user: this.user});
        }
        this.db = this.loadTable(this.currentTable);
    }

    getFullTablePath(tableName) {
        return path.join(path_to_dbs, tableName);
    }

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


    /*
    Методы для работы с пользователями
     */
    getCurrentUser() {
        return this.user;
    }

    setCurrentUser(newUser) {
        this.user = newUser;
    }
    //=================Сделать асинхронными:=========================================================
    // $
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

}



export default TableManager
