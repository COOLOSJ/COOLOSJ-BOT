require("dotenv").config(); // Load .env

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    let command;

    try {
        command = require(filePath);

        // Make sure command has data and execute
        if (!command.data || !command.execute) {
            console.log(`⚠️ Skipping ${file} (missing data or execute)`);
            continue;
        }

        // Push JSON data for Discord
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded: ${file}`);
    } catch (error) {
        console.error(`❌ Error in command file: ${file}`);
        console.error(error);
    }
}

// Create REST instance
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🔄 Registering slash commands...");

        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID
            
            ),
            { body: commands },
        );

        console.log("✅ Slash commands registered successfully!");
    } catch (error) {
        console.error("❌ Failed to register commands:");
        console.error(error);
    }
})();
