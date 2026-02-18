const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock this channel (read-only for everyone)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    // Lock channel for everyone
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    await interaction.reply({ content: '🔒 Channel locked!', ephemeral: true });

    // Optional: log in console
    console.log(`[LOCK] ${interaction.user.tag} locked #${channel.name}`);
  }
};