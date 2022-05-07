const db = require('./libdb');
const tables = require('./tables.json');
const args = process.argv.slice(2);

db.open('csdata');

if (args.includes('-c') || args.includes('--create-tables')) {
    console.log('Creating tables...');
    db.create_tables(tables);
}

if (args.includes('-s') || args.includes('--set-challenges')) {
    console.log('Inserting challenge data...');
}

console.log('Success!');
db.close();