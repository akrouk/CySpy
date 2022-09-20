const { bold } = require('@discordjs/builders');
const { TEXT } = require('sequelize');
const { CommandInteraction } = require('discord.js');
const { fetchSequelize } = require('../../helpers/database');

module.exports = {
    /**
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const sequelize = fetchSequelize(interaction).getQueryInterface();

        const gameName = interaction.options.getString('game');
        const exists = await sequelize.tableExists(gameName);

        if (!exists) return interaction.reply(`${bold(gameName)} not found.`);

        const challengeData = {
            "channel": null,
            "answers": [],
            "value": null,
            "currentValue": null,
            "files": [],
            "correct": []
        };

        await sequelize.insert(null, gameName, {
            challenge: JSON.stringify(challengeData)
        });

        interaction.client.user.setPresence({
            activities: [ { name: gameName, type: 'PLAYING' } ]
        });

        return interaction.reply(`Starting ${bold(gameName)}!`);
    }
}