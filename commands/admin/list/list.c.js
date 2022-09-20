const { resolveCommandPath } = require('../../helpers/strings');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Admin list commands.')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription('List all game instances.')
        ),
    /**
     * @param {CommandInteraction} interaction 
     */
	async execute(interaction) {
        const path = resolveCommandPath(interaction);
		await require(path).execute(interaction);
	}
};