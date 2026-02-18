const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for ban')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply({ content: 'User not found.', ephemeral: true });
        }

        const dmEmbed = new EmbedBuilder()
            .setTitle('You Have Been Banned')
            .setColor(0xff0000)
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

        await member.ban({ reason });

        await interaction.reply(`${user.tag} has been banned.\nReason: ${reason}`);
    },
};