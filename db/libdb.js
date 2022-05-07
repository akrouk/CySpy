const sqlite = require('sqlite3').verbose();
const sp = require('synchronized-promise');

class SqlMisuse extends Error {
    constructor(message) {
        super(message);
        this.name = 'SqlMisuse';
    }
}

var db;

async function async_query(sql, params = undefined) {
    checkOpen();
    return params ? await db.query(sql) : await db.query(sql, params);
}

function create_tables(tables) {
    checkOpen();
    const sql = parseTables(tables);
    sql.forEach(async (stmt) => {
        await async_query(stmt);
    });
}

async function set_chdata(params) {
    let { file, name, raw } = params;
    file ? open(file) : checkOpen();
    const sql = `
        INSERT INTO challenges (name, raw)
        VALUES (?, ?);
    `;
    const data = await db.query(sql, [name, raw]);
    console.log(data);
    return file ? (close(), data) : data;
}

let set_chdata_sync = sp(set_chdata);

async function get_chdata(args) {
    let { file, name } = typeof args === 'string' ? { name: args } : args;
    file ? open(file) : checkOpen();
    const sql = `
        SELECT raw
        FROM challenges
        WHERE name = ?;
    `;
    const data = await db.query(sql, [name]);
    return file ? (close(), JSON.parse(data[0].raw)) : JSON.parse(data[0].raw);
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

async function all_players(args) {
    let { file } = args;
    file ? open(file) : checkOpen();
    const sql = `
        SELECT *
        FROM players;
    `;
    const data = await db.query(sql);
    return file ? (close(), data) : data;
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

function parseTables(tables) {
    let sql = ``;
    
    Object.entries(tables).forEach(table => {
        const name = table[0], columns = table[1];

        sql += `CREATE TABLE IF NOT EXISTS ` + name + ` (`;
        let iterations = Object.keys(columns).length;
        
        for (const column of columns) {
            sql += column;
            if (--iterations) sql += `, `;
        }

        sql += `);\n`;
    });
    
    sqlArray = sql.split('\n');
    sqlArray.pop();
    
    return sqlArray;
}

module.exports = { 
    create_tables,
    get_chdata, get_chdata_sync, all_chdata, 
    update_chdata, all_players, 
    open, close 
}