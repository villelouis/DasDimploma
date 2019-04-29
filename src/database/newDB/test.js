// Системные
const path = require('path');
const console = require('console');
const fs = require('fs');

const DB_settings = require('../db_settings');
// путь к папке с файлами баз данных:
const path_to_dbs = path.join(__dirname, DB_settings.path_to_db);
const METATABLE_name = DB_settings.meta_table_name;

const Store = require('nedb');

function getFullTablePath(tableName){
    return path.join(path_to_dbs, tableName);
}

let db = new Store({
    filename: getFullTablePath(METATABLE_name),
    autoload: true
});

function f1(err,res){
    console.log(res)
    console.log("ID: ",res[0]._id)
}
let X = 0;

function result(){
    console.log("X is", X);
}

function f2(err,res){
    console.log(res);
    console.log("Изменили X:");
    X= res;
    console.log(X);
    result()
}


let r = db.find({},f1);
let r2 = db.findOne({},f2);


