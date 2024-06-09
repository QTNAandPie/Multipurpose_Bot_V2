const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const User = require("../../schemas/user");
const Premium = require("../../schemas/premium-user");

module.exports = {
    data: {
        name: "exchangexp",
        description: "Use token to exchange XP"
    },

    run: async ({ interaction, client }) => {
        const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        const premiumUser = await Premium.findOne({ userId: interaction.member.id, guildId: interaction.guild.id });

        if (premiumUser?.isPremium === false) {
            await interaction.reply("You just a free tier member\nUpgrade to premium tier to use this command");
        }

        const XP = 5;

        const exchangeXP = new EmbedBuilder()
            .setTitle("Exchange XP")
            .setDescription("Use token exchange to XP")
            .addFields({
                name: "XP Price",
                value: `1 Token = **${XP}** XP\n10 Tokens = **${XP * 10}** XP\n25 Tokens = **${XP * 25}** XP`,
                inline: false
            })
            .setTimestamp();

        const Token_1 = new ButtonBuilder().setCustomId("token1").setLabel("Use 1 Token").setStyle("Primary");

        const Token_10 = new ButtonBuilder().setCustomId("token10").setLabel("Use 10 Tokens").setStyle("Primary");

        const Token_25 = new ButtonBuilder().setCustomId("token25").setLabel("Use 25 Tokens").setStyle("Primary");

        const row = new ActionRowBuilder().addComponents(Token_1, Token_10, Token_25);

        const exchangeMessage = await interaction.reply({
            embeds: [exchangeXP],
            components: [row]
        });

        const collection = exchangeMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collection.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                await interaction.reply("This is not your message");
                return;
            }

            switch (i.customId) {
                case "token1":
                    if (user.token < 1) {
                        await interaction.reply("You don't have enough token to exchange");
                        return;
                    }

                    user.token -= 1;
                    user.xp += XP;

                    if (user.xp > user.requireXP) {
                        user.xp = 0;
                        user.level += 1;
                        user.requireXP += 175;
                    }

                    await user.save();

                    const successToken1Message = `Complete exchange **1** token to ${XP}\nNow you have **${user.token}** tokens`;

                    await interaction.editReply({ content: successToken1Message, embeds: [] });
                    collection.stop();
                    break;
                case "token10":
                    if (user.token < 10) {
                        await interaction.reply("You don't have enough token to exchange");
                        return;
                    }

                    user.token -= 10;
                    user.xp += 50;

                    if (user.xp > user.requireXP) {
                        user.xp = 0;
                        user.level += 1;
                        user.requireXP += 100;
                    }

                    await user.save();

                    const successToken10Message = `Complete exchange **10** token to ${XP * 5}\nNow you have **${user.token}** tokens`;

                    await interaction.editReply({ content: successToken10Message, embeds: [] });
                    collection.stop();
                    break;
                case "token25":
                    if (user.token < 25) {
                        await interaction.reply("You don't have enough token to exchange");
                        return;
                    }

                    user.token -= 25;
                    user.xp += 125;

                    if (user.xp > user.requireXP) {
                        user.xp = 0;
                        user.level += 1;
                        user.requireXP += 125;
                    }

                    await user.save();

                    const successToken25Message = `Complete exchange **25** token to ${XP * 25}\nNow you have **${user.token}** tokens`;

                    await interaction.editReply({ content: successToken25Message, embeds: [] });
                    collection.stop();
                    break;
            }
        });

        collection.on("end", (collected) => {
            interaction.editReply({
                embeds: [],
                components: []
            });
        });
    }
};
