const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by ID')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('User ID to unban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {

    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('reason') || "No reason provided.";

    try {
      const user = await interaction.client.users.fetch(userId);

      await interaction.guild.members.unban(userId, reason);

      // Try to DM them
      try {
        await user.send(
          `🔓 You have been unbanned from **${interaction.guild.name}**.\n\n📄 Reason: ${reason}`
        );
      } catch (err) {
        console.log("Couldn't DM the user.");
      }

      await interaction.reply(`✅ ${user.tag} has been unbanned.\n📄 Reason: ${reason}`);

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "❌ Failed to unban user.", ephemeral: true });
    }
  }
};