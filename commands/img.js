const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img')
        .setDescription('Send a random image')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Image topic')
                .setRequired(true)
        ),

    async execute(interaction) {

        const prompt = interaction.options.getString('prompt');

        const imageUrl = `https://picsum.photos/800/600`;

        const embed = new EmbedBuilder()
            .setTitle(`Image result for "${prompt}"`)
            .setImage(imageUrl)
            .setColor(0x00AE86);

        await interaction.reply({ embeds: [embed] });

    }
};