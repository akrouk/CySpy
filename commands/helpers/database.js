const { CommandInteraction } = require('discord.js');
const { Sequelize } = require('sequelize');

module.exports = {
    /**
     * Fetches the sequelize instance from a command interaction
     * @param {CommandInteraction} interaction 
     * @return {Sequelize}
     */
    fetchSequelize(interaction) {
        return interaction.client.sequelize; 
    }
}