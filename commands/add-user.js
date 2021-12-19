const sqlite = require('sqlite3');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-user')
		.setDescription('Adds a user to the test database.')
        .addStringOption(option => 
            option.setName('uid').setDescription('Input your user ID.').setRequired(true)
        )
        .addStringOption(option => 
            option.setName('uname').setDescription('Input your username.').setRequired(true)
        ),
	async execute(interaction) {
		let uid = interaction.options.getString('uid');
        let uname = interaction.options.getString('uname');

        let db = new sqlite.Database('./testdb.db', sqlite.OPEN_READWRITE);

        let udata = db.prepare('INSERT INTO users VALUES(?, ?)');
        udata.run(uid, uname);
        udata.finalize();
        db.close();
	}
};