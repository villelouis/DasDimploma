'use strict'

const Store = require('nedb-async').default;
const metaTableStore = require('./MetaTableStore');
const path = require('path');
const console = require('console');
const DB_settings = require('./db_settings');
const path_to_db = DB_settings.path_to_db;
const metaTableName = DB_settings.meta_table_name;

class TableManager {
    constructor(tableName = null) {

        this.metadb = new metaTableStore();
        this.currentTable = null;
        this.db = null;
        if (tableName != null){
            this.db = this.loadTable(tableName);
            this.currentTable = `${tableName}.db`
        }
    }

    loadTable(tableName) {
        let full_path = path.join(path_to_db, `${tableName}.db`);
        console.log(`Я собираюсь загрузить ${full_path}`);
        this.db = new Store({
            filename: full_path,
            autoload: true
        });
        console.log(this.db);
        this.db.loadDatabase((err) => {
                console.log("loadTable",err)
            }
        );
    }

    setCurrentTable(tableName){
        this.loadTable(tableName);
        this.currentTable = tableName;
    }

    getCurrntTable(){
        return this.currentTable;
    }

    addTable(tableName,caption,columns){
        return this.metadb.addTable(tableName,caption,columns);
    }

    getTable(tableName){
        return this.metadb.getTable(tableName);
    }

    getAllTables(){
        return this.metadb.getAllTables();
    }

    removeTable(tableName) {
        return this.metadb.removeTable(tableName);
    }

    addRecord(columnValues) {
        return this.db.asyncInsert(columnValues);
    }

    getAllRecords() {
        return this.db.asyncFind({});
    }

    getRecordById(recordId) {
        return this.db.asyncFindOne({_id: recordId});
    }

    updateRecord(recordId, changesDict) {
        return this.db.asyncUpdate({_id: recordId}, changesDict);
    }

    removeRecordById(recordId) {
        return this.db.asyncRemove({_id: recordId});
    }
}

function test() {
    let db = new TableManager("Bananas");

    db.removeRecordById("B").then();

    db.addRecord({_id: "A", name: "simple", cost: 60, color: "yellow"})
        .then()
        .catch((e) => {
            console.log("Ошибка во время добавления записи")
        });

    db.addRecord({_id: "B", name: "origin", cost: 20, color: "white-yellow"})
        .then()
        .catch((e) => {
            console.log("Ошибка во время добавления записи")
        });
    // с помощью set меняем только выделенные поля :
    db.updateRecord("B", {$set: {name: "Ipata", cost: 77}});

    db.getAllRecords()
        .then((result) => {
            console.log(result)
        })
        .catch((e) => {
            console.log("Ошибка во время получения всех записей")
        });

    db.getRecordById("A").then((record) => {
        console.log(record)
    })
}

function test_meta_table_store_methods() {
    let db = new TableManager();
    db.addTable("Вишенки","Вишенки!",["красные","синие","зелёные","ещё какие то"]).then().catch((err)=>{
        console.log(err)
    });
    db.addTable("Пироженки","Сюськи!",["красные","синие","зелёные","ещё какие то"]).then().catch((err)=>{
        console.log(err)
    });
    db.getAllTables().then((res)=>{
        console.log(res);
        db.removeTable("Пироженки").then().catch((err)=>{
            console.log(err)
        });
        db.getAllTables().then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err)
        });
    });
    return db;
}

function test_add_values(){
    // создаём таблицу Вишенки, после добавляем в нёё значения
    let db = test_meta_table_store_methods();
    console.log(db.getCurrntTable());
    db.setCurrentTable('Вишенки');
    db.addRecord(["80","11","12","23"]).then(
        () => {
            db.getAllRecords().then(
                (r) => {console.log(r)}
            )
        }
    )
}

function testLoadTable(){
    let db = new TableManager("Banana");
    db.loadTable("Banana")
    // console.log(db.getCurrntTable());
    // db.addRecord(["80","11","12","23"]).then(
    //     () => {
    //         db.getAllRecords().then(
    //             (r) => {console.log(r)}
    //         )
    //     }
    // )
}
testLoadTable()

module.exports = TableManager;
