// Системные
const path = require('path');
const console = require('console');
const fs = require('fs');

const DB_settings = require('../db_settings');
// путь к папке с файлами баз данных:
const path_to_dbs = path.join(__dirname, DB_settings.path_to_db);
const METATABLE_name = DB_settings.meta_table_name;

const Store = require('nedb');

let METATABLE = new Store({
    filename: getFullTablePath(METATABLE_name),
    autoload: true
});
let USER = "MAX";

function getFullTablePath(tableName) {
    return path.join(path_to_dbs, tableName);
}


function asyncGetAllTables() {
    return new Promise(function (resolve, reject) {
        METATABLE.find({}, function (err,doc) {
            if (err){
                reject(err);
            } else {
                resolve(doc);
            }
        });
    });
}

function asyncAddTableToMETATABLE(tableName, {caption, user} = {}) {
    return new Promise(function (resolve, reject) {
            user = user === undefined ? USER : user;
            caption = caption === undefined ? tableName : caption;
            let doc = {
                _id: `${user}@${tableName}`,
                user: user,
                table: tableName,
                caption: caption
            };
            METATABLE.insert(doc, function (err,doc) {
                if (err){
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
    })
}

async function AsyncGetAllTables(reject,resolve) {
    return METATABLE.find({},async (err,doc)=>{
        if (err){
            reject(err);
        } else {
            resolve(doc);
        }
    })
}

// AsyncGetAllTables(null,function (doc) {
//     console.log(doc)
// }).then();
asyncAddTableToMETATABLE("A")
    .then(asyncAddTableToMETATABLE("B"))
    .then(asyncAddTableToMETATABLE("C"))
    .then(asyncAddTableToMETATABLE("D"))
    .then(asyncAddTableToMETATABLE("E"))
    .then(asyncAddTableToMETATABLE("F"))
    .then(asyncAddTableToMETATABLE("G"))
    .then(asyncAddTableToMETATABLE("H"))
    .then(asyncAddTableToMETATABLE("I"))
    .then(asyncAddTableToMETATABLE("L"))
    .then(asyncAddTableToMETATABLE("1"))
    .then(asyncAddTableToMETATABLE("2"))
    .then(asyncAddTableToMETATABLE("3"))
    .then(asyncAddTableToMETATABLE("4"))
    .then(asyncAddTableToMETATABLE("5"))
    .then(asyncAddTableToMETATABLE("6"))
    .then(asyncAddTableToMETATABLE("7"))
    .then(asyncAddTableToMETATABLE("8"));
asyncGetAllTables().then(function (doc) {console.log(doc)});

