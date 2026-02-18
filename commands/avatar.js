const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Display a user avatar')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to get avatar from')
        .setRequired(false)
    ),

  async execute(interaction) {

    const user = interaction.options.getUser('user') || interaction.user;

    const avatarURL = user.displayAvatarURL({
      size: 1024,
      dynamic: true
    });

    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Avatar`)
      .setImage(avatarURL)
      .setColor("Blue")
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }
};