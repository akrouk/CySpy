const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('./csdata.db', error => {
    if (error) {
        return console.error(error.message);
    }
});

db.query = function (sql, params = []) {
    return new Promise((res, rej) => {
        this.all(sql, params, function (error, result) {
            if (error) {
                rej(error);
            } else {
                res(result);
            }
        });
    });
}

async function get_chdata(name) {
    const sql = `
        SELECT raw
        FROM challenges
        WHERE name = ?;
    `;
    return await db.query(sql, [name]);
}

async function update_chdata(name, raw) {
    const sql = `
        UPDATE challenges
        SET raw = ?
        WHERE name = ?;
    `;
    return await db.query(sql, [raw, name]);
}

function close_db() {
    db.close();
}

module.exports = { get_chdata, update_chdata, close_db }