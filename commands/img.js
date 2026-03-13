const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const PEXELS_KEY = process.env.PEXELS_KEY;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img')
        .setDescription('Search for an image')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Image to search')
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        const prompt = interaction.options.getString('prompt');

        try {

            const response = await axios.get(
                `https://api.pexels.com/v1/search?query=${prompt}&per_page=1`,
                {
                    headers: { Authorization: PEXELS_KEY }
                }
            );

            const image = response.data.photos[0].src.large;

            const embed = new EmbedBuilder()
                .setTitle(`Image result for "${prompt}"`)
                .setImage(image)
                .setColor(0x00AE86);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {

            await interaction.editReply("Couldn't find an image.");

        }
    }
};