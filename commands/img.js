const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img')
        .setDescription('Send an image based on a prompt')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Image to search')
                .setRequired(true)
        ),

    async execute(interaction) {

        const prompt = interaction.options.getString('prompt');

        const imageUrl = `https://source.unsplash.com/800x600/?${prompt}`;

        const embed = new EmbedBuilder()
            .setTitle(`Image result for "${prompt}"`)
            .setImage(imageUrl)
            .setColor(0x00AE86);

        await interaction.reply({ embeds: [embed] });

    }
};