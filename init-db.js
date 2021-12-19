const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite3');

module.exports = {
    initdb() {
        let db = new sqlite.Database('./csdata.db', sqlite.OPEN_READWRITE);

        db.run(
            `CREATE TABLE IF NOT EXISTS players (id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, points INT NOT NULL DEFAULT 0);
            CREATE TABLE IF NOT EXISTS embeds (embedName TEXT NOT NULL UNIQUE, jsonData TEXT NOT NULL)`, 
            error => {
                if (error) {
                    console.error(error); 
                }
                db.close();
            }
        );
    },
    loadEmbedData() {
        let db = new sqlite.Database('./csdata.db', sqlite.OPEN_READWRITE);
        let embedData = db.prepare('INSERT INTO embeds VALUES(?, ?)');
        
        const dataFiles = fs.readdirSync('./data').filter(file => file.endsWith('.json'));

        for (const file of dataFiles) {
            const obj = require(`./data/${file}`);
            embedData.run(path.parse(file).name, JSON.stringify(obj));
        }

        embedData.finalize();
        db.close();
    }
}