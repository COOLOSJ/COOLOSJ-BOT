const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Duration in minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {

    const member = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason') || "No reason provided.";

    if (!member) {
      return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    }

    const durationMs = minutes * 60 * 1000;

    try {
      // Try to DM the user first
      try {
        await member.send(
          `⏳ You have been timed out in **${interaction.guild.name}**.\n\n` +
          `🕒 Duration: ${minutes} minute(s)\n` +
          `📄 Reason: ${reason}\n\n` +
          `If you believe this was a mistake, contact the server staff.`
        );
      } catch (err) {
        console.log("Couldn't DM the user.");
      }

      // Apply timeout
      await member.timeout(durationMs, reason);

      await interaction.reply({
        content: `✅ ${member.user.tag} has been timed out for **${minutes} minute(s)**.\n📄 Reason: ${reason}`,
        ephemeral: false
      });

    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "❌ Failed to timeout the member.",
        ephemeral: true
      });
    }
  }
};