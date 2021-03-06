const fs = require('fs');
const path = require('path');
const db = require('./db/libdb');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.embeds = new Collection();
const chdataFiles = fs.readdirSync('./chdata').filter(file => file.endsWith('.js'));

for (const file of chdataFiles) {
    const chdata = require(`./chdata/${file}`);
    client.embeds.set(path.parse(file).name, chdata.embed);
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
	} catch (err) {
		console.error(err, err.stack);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);