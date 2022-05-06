const db = require('../func/db');
const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configure')
		.setDescription('Configures the text channel for the test challenge.')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName('test').setDescription('Configure the test challenge.').addStringOption(option => 
                option.setName('category-id').setDescription('ID of category to create the channel in.').setRequired(true)
            )    
        )
        .addSubcommand(subcommand =>
            subcommand.setName('challenges').setDescription('Configure all challenges.').addStringOption(option => 
                option.setName('category-id').setDescription('ID of category to create the channel in.').setRequired(true)
            )    
        ),
	async execute(interaction) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await interaction.reply({ content: 'Sorry, this command requires Administrator permissions!', ephemeral: true });
            return;
        }

        if (interaction.options.getSubcommand() === 'test') {
            db.open('csdata');
            const painting = await db.get_chdata('painting');

            let channel = await interaction.guild.channels.create(painting.channel, {
                type: 'GUILD_TEXT',
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [ Permissions.FLAGS.VIEW_CHANNEL ]
                    }
                ]
            });

            let categoryId = await interaction.options.getString('category-id');
            channel.setParent(categoryId, { lockPermissions: false });

            const embed = interaction.client.embeds.get('painting');
            let sent = await channel.send({ embeds: [ embed ] });

            painting.channelId = channel.id;
            painting.embedId = sent.id; 

            await db.update_chdata('painting', JSON.stringify(painting));
            db.close();
        }

        await interaction.reply({ content: 'Success!', ephemeral: true });
	}
};