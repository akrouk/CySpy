const db = require('../func/db');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure-test')
		.setDescription('Configures the text channel for the test challenge.')
        .addStringOption(option => 
            option.setName('category-id').setDescription('ID of category to create the channel in.').setRequired(true)
        ),
	async execute(interaction) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ content: 'Sorry, this command requires Administrator permissions!', ephemeral: true });
            return;
        }

        db.open('csdata');
        const painting = await db.get_chdata('painting');
        const obj = JSON.parse(painting.raw);

        let channel = await interaction.guild.channels.create(obj.channel, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [ Permissions.FLAGS.VIEW_CHANNEL ]
                }
            ]
        });

        let categoryId = await interaction.options.getString('category-id');
        channel.setParent(categoryId, { lockPermissions: false });

        const embed = interaction.client.embeds.get('painting');
        let sent = await channel.send({ embeds: [ embed ] });

        obj.channelId = channel.id;
        obj.embedId = sent.id; 

        await db.update_chdata('painting', JSON.stringify(obj));
        db.close();
        await interaction.reply({ content: 'Success!', ephemeral: true });
	}
};