const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to warn')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for warning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const dmEmbed = new EmbedBuilder()
            .setTitle('You Have Received a Warning')
            .setColor(0xffff00)
            .addFields(
                { name: 'Server', value: interaction.guild.name },
                { name: 'Moderator', value: interaction.user.tag },
                { name: 'Reason', value: reason }
            )
            .setTimestamp();

        try {
            await user.send({ embeds: [dmEmbed] });
        } catch (err) {
            console.log('Could not DM the user.');
        }

        await interaction.reply(`${user.tag} has been warned.\nReason: ${reason}`);
    },
};