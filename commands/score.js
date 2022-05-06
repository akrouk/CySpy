const db = require('../func/db');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('score')
		.setDescription('Displays the user\'s current score.'),
	async execute(interaction) {
        //ADD WAY TO CHECK THAT A PLAYER IS REGISTERED!!!

        const scoreEmbed = new MessageEmbed()
            .setColor(interaction.member.displayHexColor)
            .setAuthor(
                { name: interaction.member.user.username, iconURL: interaction.member.user.avatarURL({ dynamic: true }) }
            )
            .addFields(
                { name: 'Points', value: '0', inline: true },
                { name: 'Place', value: '1st', inline: true }
            );

        await interaction.reply({ embeds: [ scoreEmbed ] });
    }
}