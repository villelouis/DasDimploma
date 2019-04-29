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
    constructor(tableName, user, {caption}={}) {
        this.user = user;
        this.currentTable = tableName;
        this.METATABLE = this.loadTable(METATABLE_name);
        if (!this.tableExists(tableName)) {
            this.addTableToMETATABLE(tableName, {caption:caption, user:user});
        }
        this.db = this.loadTable(tableName);
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

    setCurrentTable(tableName, {caption, user,callback}={}) {
        if (!this.tableExists(tableName)) {
            this.addTableToMETATABLE(tableName, {caption:caption, user:user,callback:callback})
        }
        this.currentTable = tableName;
        this.db = this.loadTable(tableName);
    }

    getCurrentTable() {
        return this.currentTable;
    }

    getAllTablesOfUser({callback, user}={}) {
        user = user === undefined? this.user : user;
        return this.METATABLE.find({user: user}, callback)
    }

    getAllTables(callback) {
        this.METATABLE.find({}, callback)
    }

    removeTable({tableName,callback}={}) {
        tableName = tableName === undefined ? this.currentTable : tableName;
        this.removeTableFromMETATABLE(tableName,{callback:callback});
        fs.unlink(this.getFullTablePath(tableName), (err) => {
            if (err) throw err;
            console.log(`${tableName} was deleted`);
        });
        this.currentTable = this.currentTable === tableName ? undefined:this.currentTable;
    }

    renameTable(newName, {tableName}={}) {
        tableName = tableName === undefined ? this.currentTable: tableName;

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
    addTableToMETATABLE(tableName, {caption, user,callback}={}) {
        user = user === undefined ? this.user : user;
        caption = caption === undefined ? tableName : caption;
        let doc = {
            _id: `${user}@${tableName}`,
            user: user,
            table: tableName,
            caption: caption
        };
        this.METATABLE.insert(doc,callback);
    }

    removeTableFromMETATABLE(tableName,{callback,user}={}){
        user = user === undefined ? this.user : user;
        console.log("remove for USER ==================>",user,tableName);
        this.METATABLE.remove({_id:`${user}@${tableName}`},callback);
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
    addRecord(item, columnValuesDict) {
        this.db.insert(Object.assign(item, columnValuesDict));
    }

}

function t() {
    // ======================================================
    let db = new TableManager("Bananas", "Max");
    console.log("Текущая таблица", db.getCurrentTable());
    console.log("Текущий пользователь", db.getCurrentUser());
    // =======================================================
    db.getAllTables(function (err, res) {
        console.log("Все имеющиеся таблицы: ");
        console.log(res)
    });
    // =======================================================
    db.getAllTablesOfUser({user:"Max", callback:function (err, res) {
        console.log("Таблицы опр пользователя: ");
        console.log(res)
    }});
    db.getAllTablesOfUser({user:"Jake", callback:function (err, res) {
        console.log("Таблицы несуществующего пользователя: ");
        console.log(res)
    }});
    // =======================================================
    db.setCurrentTable("Apples",{callback:()=>{
            db.getAllTables(function (err, res) {
                console.log("Создадим новую (тоже что и СМЕНИМ) таблицу: ");
                console.log("Проверим, что всё обновилось: ");
                console.log("Все таблицы: ");
                console.log(res);
                db.getAllTablesOfUser({user:"Max", callback:function (err, res) {
                        console.log("Таблицы пользователя: ");
                        console.log(res);
                    }});
                console.log("Текущая таблица:", db.getCurrentTable());
                db.removeTable({tableName:'Apples',callback:function (err,res) {
                        console.error("========================================");
                        console.log("Пробуем удаление табицы",res);
                        console.error("========================================");
                    }});
                db.getAllTablesOfUser({user:"Max", callback:function (err, res) {
                        console.log("Таблицы пользователя после удаления: ");
                        console.log(res);
                        console.log("Текущая таблица ПОСЛЕ УДАЛЕНИЯ:", db.getCurrentTable());
                    }});
            });
            db.setCurrentTable("Bananas",{callback:()=>{}});
        }});

    // =======================================================

    // db.setCurrentTable("Oranges",{callback:()=>{}});
    // =======================================================
}

t();
