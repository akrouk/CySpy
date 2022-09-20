const read = require('fs-readdir-recursive');
const { Sequelize } = require('sequelize');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [ 
    Intents.FLAGS.GUILDS, 
    Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_PRESENCES 
] });

client.sequelize = new Sequelize('database', 'user', null, {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './data/cyspy.sqlite'
});

client.commands = new Collection();
const commandFiles = read('./commands').filter(file => file.endsWith('.c.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('CySpy is online!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);
