const sqlite = require('sqlite3').verbose();
const sp = require('synchronized-promise');

class SqlMisuse extends Error {
    constructor(message) {
        super(message);
        this.name = 'SqlMisuse';
    }
}

var db;

async function get_chdata(args) {
    let { file, name } = typeof args === 'string' ? { name: args } : args;
    file ? open(file) : checkOpen();
    const sql = `
        SELECT raw
        FROM challenges
        WHERE name = ?;
    `;
    const data = await db.query(sql, [name]);
    return file ? (close(), data[0]) : data[0];
}

let get_chdata_sync = sp(get_chdata);

async function all_chdata() {
    checkOpen();
    const sql = `
        SELECT raw
        FROM challenges;
    `;
    return await db.query(sql);
}

async function update_chdata(name, raw) {
    checkOpen();
    const sql = `
        UPDATE challenges
        SET raw = ?
        WHERE name = ?;
    `;
    return await db.query(sql, [raw, name]);
}

function open(file) {
    db = new sqlite.Database(`./${file}.db`, err => {
        if (err) {
            console.error(err, err.stack);
        }
    });

    db.query = function (sql, params = []) {
        return new Promise((res, rej) => {
            this.all(sql, params, function (err, result) {
                if (err) {
                    rej(err);
                } else {
                    res(result);
                }
            });
        });
    }
}

function close() {
    db.close();
    db = undefined; 
}

function checkOpen() {
    if (!db) {
        throw new SqlMisuse('Database is not open.');
    }
}

module.exports = { get_chdata, get_chdata_sync, all_chdata, update_chdata, open, close }