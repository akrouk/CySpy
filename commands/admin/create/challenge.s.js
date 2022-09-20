const { bold } = require('@discordjs/builders');
const { TEXT } = require('sequelize');
const { CommandInteraction } = require('discord.js');
const { fetchSequelize } = require('../../helpers/database');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        
        return interaction.reply('Boop');
    }
}