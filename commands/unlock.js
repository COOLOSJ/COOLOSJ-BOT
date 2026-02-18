const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock this channel (allow everyone to send messages)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    // Unlock channel for everyone
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true
    });

    await interaction.reply({ content: '🔓 Channel unlocked!', ephemeral: true });

    // Optional: log in console
    console.log(`[UNLOCK] ${interaction.user.tag} unlocked #${channel.name}`);
  }
};