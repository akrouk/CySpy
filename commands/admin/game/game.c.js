const { resolveCommandPath } = require('../../helpers/strings');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Game instance admin commands.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a game instance.')  
                .addStringOption(option =>
                    option
                        .setName('game')
                        .setDescription('Which game to start.')
                        .setRequired(true)    
                )  
        ),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        const path = resolveCommandPath(interaction);
		await require(path).execute(interaction);
	}
};