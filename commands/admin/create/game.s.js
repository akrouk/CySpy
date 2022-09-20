const { bold } = require('@discordjs/builders');
const { TEXT } = require('sequelize');
const { CommandInteraction } = require('discord.js');
const { fetchSequelize } = require('../../helpers/database');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const sequelize = fetchSequelize(interaction);
        const gameName = interaction.options.getString('name');

        const game = sequelize.define(gameName, { challenge: TEXT }, {
            timestamps: false,
            freezeTableName: true
        });

        game.sync();
        return interaction.reply(`Game ${bold(gameName)} successfully created!`);
    }
}