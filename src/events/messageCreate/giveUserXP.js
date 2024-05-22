const { Client, Message } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXP");
const rank = require("../../schemas/rank");
const cooldowns = new Set();

function getRandomXP(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (message, client) => {
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

    const xpToGive = getRandomXP(8, 20);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id
    };

    try {
        const level = await rank.findOne(query);

        if (level) {
            level.xp += xpToGive;

            if (level.xp > calculateLevelXp(level.level)) {
                level.xp = 0;
                level.level += 1;

                message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`);
            }

            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 2000);
        } else {
            const NewRank = new rank({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive
            });

            await NewRank.save();
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 2000);
        }
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }
};
