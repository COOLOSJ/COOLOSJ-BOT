const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Start a giveaway')
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Duration in minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('prize')
        .setDescription('Prize to giveaway')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {

    const minutes = interaction.options.getInteger('minutes');
    const prize = interaction.options.getString('prize');
    const duration = minutes * 60 * 1000;

    const participants = new Set();

    const embed = new EmbedBuilder()
      .setTitle("🎉 Giveaway 🎉")
      .setDescription(`Prize: **${prize}**\n\nClick the button below to enter!`)
      .setFooter({ text: `Ends in ${minutes} minute(s)` })
      .setColor("Gold");

    const button = new ButtonBuilder()
      .setCustomId("enter_giveaway")
      .setLabel("🎉 Enter")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

    // Store giveaway
    interaction.client.giveaways.set(message.id, participants);

    const collector = message.createMessageComponentCollector({
      time: duration
    });

    collector.on("collect", async i => {

      if (i.customId !== "enter_giveaway") return;

      if (participants.has(i.user.id)) {
        return i.reply({
          content: "❌ You already entered!",
          ephemeral: true
        });
      }

      participants.add(i.user.id);

      await i.reply({
        content: "✅ You entered the giveaway!",
        ephemeral: true
      });
    });

    collector.on("end", async () => {

      // Disable button
      const disabledButton = new ButtonBuilder()
        .setCustomId("enter_giveaway")
        .setLabel("🎉 Ended")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true);

      const disabledRow = new ActionRowBuilder().addComponents(disabledButton);

      if (participants.size === 0) {

        const endedEmbed = new EmbedBuilder()
          .setTitle("🎉 Giveaway Ended")
          .setDescription(`Prize: **${prize}**\n\n❌ No one entered.`)
          .setColor("Red");

        return message.edit({
          embeds: [endedEmbed],
          components: [disabledRow]
        });
      }

      const winnerId = Array.from(participants)[
        Math.floor(Math.random() * participants.size)
      ];

      const winner = await interaction.client.users.fetch(winnerId);

      // 🎉 Update embed
      const endedEmbed = new EmbedBuilder()
        .setTitle("🎉 Giveaway Ended")
        .setDescription(
          `Prize: **${prize}**\n\n🏆 Winner: <@${winnerId}>\n👥 Entries: ${participants.size}`
        )
        .setColor("Green");

      await message.edit({
        embeds: [endedEmbed],
        components: [disabledRow]
      });

      // 🎉 Ping winner in channel
      await interaction.followUp(
        `🎉 Congratulations <@${winnerId}>! You won **${prize}**!`
      );

      // 📩 Try DM winner
      try {
        await winner.send(
          `🎉 Congratulations! You won **${prize}** in **${interaction.guild.name}**!\n\nPlease contact a staff member to claim your prize.`
        );
      } catch (error) {
        console.log("Winner has DMs closed.");
      }
    });
  }
};