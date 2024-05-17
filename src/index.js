require('dotenv/config');

const { Client, IntentsBitField } = require('discord.js');
const { CommandKit } = require('commandkit');
const { join } = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ],
});

new CommandKit({
    client,
    eventsPath: join(__dirname, 'events'),
});

client.login(process.env.TOKEN);
