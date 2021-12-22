const sqlite = require('sqlite3').verbose();

class SqlMisuse extends Error {
    constructor(message) {
        super(message);
        this.name = 'SqlMisuse';
    }
}

var db;

async function get_chdata(name) {
    checkOpen();
    const sql = `
        SELECT raw
        FROM challenges
        WHERE name = ?;
    `;
    return await db.query(sql, [name]);
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
    if (db === undefined) {
        throw new SqlMisuse('Database is not open.');
    }
}

module.exports = { get_chdata, update_chdata, open, close }