const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite3').verbose();

const args = process.argv.slice(2);
let db = new sqlite.Database('./csdata.db', sqlite.OPEN_READWRITE);

console.log('Creating tables...');

db.run('CREATE TABLE IF NOT EXISTS challenges (name TEXT NOT NULL UNIQUE, raw TEXT NOT NULL)', error => {
    if (error) {
        console.error; 
    }
});

db.run('CREATE TABLE IF NOT EXISTS players (id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, points INT NOT NULL DEFAULT 0)', error => {
    if (error) {
        console.error; 
    }
});

console.log('Tables created successfully!');

db.close();

if (args.includes('-pch') || args.includes('--process-challenges')) {
    setTimeout(() => {
        let db = new sqlite.Database('./csdata.db', sqlite.OPEN_READWRITE);
        let statement = db.prepare('INSERT INTO challenges VALUES(?, ?)');

        const dataFiles = fs.readdirSync('./chdata').filter(file => file.endsWith('.js'));

        console.log('Processing raw challenge data...');

        for (const file of dataFiles) {
            const data = require(`./chdata/${file}`);
            statement.run(path.parse(file).name, JSON.stringify(data.raw));
        }

        statement.finalize();

        console.log('Challenge data processed successfully!');

        db.close();
    }, 1000);
}