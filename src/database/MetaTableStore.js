'use strict';

const Store = require('nedb-async').default;
const fs = require('fs');
const console = require('console');
const path = require('path');
const DB_settings = require('./db_settings');
const path_to_db = DB_settings.path_to_db;
const meta_table_name = DB_settings.meta_table_name;
class MetaTableStore {
    constructor() {
        this.db = new Store({
            filename: path.join(path_to_db,meta_table_name),
            autoload: true
        });
    }

    addTable(tableName,caption,columns) {
        let doc = {
            _id: tableName,
            caption:caption,
            columns:[...columns]
        };
        new Store({
            filename: path.join(path_to_db,`${tableName}.db`),
            autoload: true
        });
        return this.db.asyncInsert(doc);
    }

    getTable(tableName){
        return this.db.asyncFindOne({_id: tableName});
    }

    getAllTables(){
        return this.db.asyncFind({},{_id:1,caption:1})
    }

    removeTable(tableName){
        fs.unlink(path.join(__dirname,path_to_db,`${tableName}.db`), (err) => {
            if (err) throw err;
            console.log(`${tableName}.db was deleted`);
        });
        return this.db.asyncRemove({_id: tableName})
    }

}

module.exports = MetaTableStore;

function test_common() {
    let db = new MetaTableStore();

    db.addTable('newTable',"Ягоды",['арбузы','ежевика','смородина']).then(() => {
        console.log("Работаем")
    }).catch(()=>{console.log("Произошла ошибка при создании таблицы")});

    db.getTable('newTable').then((result) => {
        console.log(result)
    }).catch(()=>{console.log("Произошла ошибка при получении таблицы")});

    db.getAllTables().then((result) => {
        for (let e in result){
            console.log("id",result[e]['_id'],"| заголовок",result[e]['caption']);
        }
    }).catch(()=>{console.log("Произошла ошибка при получении списка таблиц")});
}

function test_get_unexisting_table() {
    /*
    * При попытке получить несуществующую таблицу - получаем null
     */
    let db = new MetaTableStore();
    db.getTable('sometable').then((result) => {
        console.log(result)
    }).catch(()=>{console.log("Произошла ошибка при получении таблицы")});
}

function test_remove_table() {
    let db = new MetaTableStore();
    db.addTable('Ягоды',"Ягоды",['арбузы','ежевика','смородина']).then();
    db.addTable('Пироженки',"Пироженки",['кексы','прянники','печеньки']).then(
        ()=>{
            db.removeTable('Пироженки').then();
            db.getAllTables().then((res)=>{console.log(res)});
        }
    );
    db.getAllTables().then((res)=>{console.log(res)});
}

// test_common();
// test_remove_table();
