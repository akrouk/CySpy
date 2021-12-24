const db = require('../func/db');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Deletes configured text channels.'),
	async execute(interaction) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ content: 'Sorry, this command requires Administrator permissions!', ephemeral: true });
            return;
        }

        db.open('csdata');
        const chdata = await db.all_chdata();
        
        for (const challenge of chdata) {
            const obj = JSON.parse(challenge.raw);
            let channel = await interaction.client.channels.cache.get(obj.channelId);
            channel.delete();
        }

        db.close();
        await interaction.reply({ content: 'Success!', ephemeral: true });
    }
}