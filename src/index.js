require("dotenv/config");

const { Client, IntentsBitField } = require("discord.js");
const { CommandKit } = require("commandkit");
const mongoose = require("mongoose");
const { join } = require("path");

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildPresences]
});

new CommandKit({
    client,
    eventsPath: join(__dirname, "events"),
    commandsPath: join(__dirname, "commands")
});

(async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.DB_CLIENT);
        console.log("Connected to MongoDB");
    } catch {
        console.log("Failed connected. Try again");
    }
})();

client.login(process.env.TOKEN);
