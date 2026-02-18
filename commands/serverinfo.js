const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display server information'),

  async execute(interaction) {

    const { guild } = interaction;

    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} - Server Info`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: "👑 Owner", value: owner.user.tag, inline: true },
        { name: "👥 Members", value: `${guild.memberCount}`, inline: true },
        { name: "📅 Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: false },
        { name: "🚀 Boost Level", value: `Level ${guild.premiumTier}`, inline: true },
        { name: "💎 Boosts", value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
        { name: "📂 Channels", value: `${guild.channels.cache.size}`, inline: true }
      )
      .setColor("Green")
      .setFooter({ text: `Server ID: ${guild.id}` });

    await interaction.reply({ embeds: [embed] });
  }
};