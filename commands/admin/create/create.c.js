const { resolveCommandPath } = require('../../helpers/strings');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Admin creation commands.')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('game')
                .setDescription('Create a game instance.')
                .addStringOption(option => 
                    option
                        .setName('name')
                        .setDescription('The name of the new game.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('challenge')
                .setDescription('Create a game challenge.')
                .addStringOption(option => 
                    option
                        .setName('game')
                        .setDescription('Which game to create the challenge for.')
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