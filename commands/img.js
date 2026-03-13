const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img')
        .setDescription('Search and send an image')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Image to search')
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        const prompt = interaction.options.getString('prompt');

        const url = `https://source.unsplash.com/800x600/?${prompt}`;

        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        const attachment = new AttachmentBuilder(response.data, { name: 'image.jpg' });

        await interaction.editReply({ files: [attachment] });

    }
};