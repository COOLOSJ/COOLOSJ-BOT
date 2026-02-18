const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a timed poll')
    // ✅ Required options first
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Poll question')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option1')
        .setDescription('First option')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option2')
        .setDescription('Second option')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Duration in minutes')
        .setRequired(true))
    // ⬇ Optional options after all required
    .addStringOption(option =>
      option.setName('option3')
        .setDescription('Third option')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option4')
        .setDescription('Fourth option')
        .setRequired(false)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const minutes = interaction.options.getInteger('minutes');
    const duration = minutes * 60 * 1000;

    // Collect provided options
    const options = [];
    for (let i = 1; i <= 4; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if (opt) options.push(opt);
    }

    const votes = new Map(); // userId -> option index
    const voteCounts = Array(options.length).fill(0);

    const embed = new EmbedBuilder()
      .setTitle("📊 Poll")
      .setDescription(`**${question}**\n\n${options.map((opt, i) => `**${i + 1}.** ${opt} — 0 votes`).join("\n")}`)
      .setFooter({ text: `Ends in ${minutes} minute(s)` })
      .setColor("Blue");

    const row = new ActionRowBuilder().addComponents(
      options.map((opt, i) =>
        new ButtonBuilder()
          .setCustomId(`vote_${i}`)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true
    });

    const collector = message.createMessageComponentCollector({
      time: duration
    });

    collector.on("collect", async i => {
      const optionIndex = parseInt(i.customId.split("_")[1]);

      // Remove previous vote
      if (votes.has(i.user.id)) {
        const previous = votes.get(i.user.id);
        voteCounts[previous]--;
      }

      votes.set(i.user.id, optionIndex);
      voteCounts[optionIndex]++;

      const updatedEmbed = new EmbedBuilder()
        .setTitle("📊 Poll")
        .setDescription(`**${question}**\n\n${options.map((opt, index) => `**${index + 1}.** ${opt} — ${voteCounts[index]} vote(s)`).join("\n")}`)
        .setFooter({ text: `Ends in ${minutes} minute(s)` })
        .setColor("Blue");

      await message.edit({ embeds: [updatedEmbed] });

      await i.reply({
        content: `✅ You voted for: ${options[optionIndex]}`,
        ephemeral: true
      });
    });

    collector.on("end", async () => {
      const maxVotes = Math.max(...voteCounts);
      const winners = options.filter((opt, i) => voteCounts[i] === maxVotes);

      const disabledRow = new ActionRowBuilder().addComponents(
        options.map((opt, i) =>
          new ButtonBuilder()
            .setCustomId(`vote_${i}`)
            .setLabel(`${i + 1}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        )
      );

      const finalEmbed = new EmbedBuilder()
        .setTitle("📊 Poll Ended")
        .setDescription(`**${question}**\n\n${options.map((opt, index) => `**${index + 1}.** ${opt} — ${voteCounts[index]} vote(s)`).join("\n")}\n\n🏆 Winner: **${winners.join(", ")}**`)
        .setColor("Green");

      await message.edit({
        embeds: [finalEmbed],
        components: [disabledRow]
      });
    });
  }
};