const { indexedList } = require('../../helpers/strings');
const { fetchSequelize } = require('../../helpers/database');
const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const sequelize = fetchSequelize(interaction);
        const gamesList = await sequelize.getQueryInterface().showAllSchemas();

        const gamesEmbed = new MessageEmbed()
            .setTitle('Games')
            .setDescription(indexedList(gamesList.map(game => game.name)) ?? 'There are no games.');

        return interaction.reply({ embeds: [ gamesEmbed ] });
    }
}