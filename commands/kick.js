const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'User not found.', ephemeral: true });
        }

        const dmEmbed = new EmbedBuilder()
            .setTitle('You Have Been Kicked')
            .setColor(0xff9900)
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

        await member.kick(reason);

        await interaction.reply(`${user.tag} has been kicked.\nReason: ${reason}`);
    },
};