
const { bold } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
    /**
     * Resolves the path to a subcommand file.
     * @param {CommandInteraction} interaction 
     * @returns {string}
     */
    resolveCommandPath(interaction) {
        const groupName = interaction.options.getSubcommandGroup(false);
        const groupPath = groupName ? `${groupName}/` : '';
        return `./${groupPath}${interaction.options.getSubcommand()}.s`;
    },

    /**
     * Converts an array of strings to an indexed list string.
     * @param {string[]} array 
     * @returns {string}
     */
    indexedList(array) {
        if (array.length === 0) return undefined;
        var list = new String(), i = 0;

        for (const element of array) {
            list += (bold(++i + '. ') + element);
            if (i !== array.length) list += '\n';
        }

        return list;
    }
}