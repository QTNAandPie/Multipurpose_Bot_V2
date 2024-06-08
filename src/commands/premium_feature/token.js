const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const Premium = require("../../schemas/premium-user");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "buytoken",
        description: "Buy the token"
    },

    run: async ({ interaction, client }) => {
        const premiumUser = await Premium.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

        if (premiumUser.isPremium === false) {
            await interaction.reply("You just a free tier member\nUpgrade to premium tier to use this command");
            return;
        }
        const tokenPrice = 5000000;

        const tokenShop = new EmbedBuilder()
            .setTitle("Buy token (Premium Only)")
            .setDescription("By buying the token, you can use token convert to XP or buy in token shop")
            .addFields({
                name: "Token price",
                value: `1 Token = **$${tokenPrice.toLocaleString()}**\n10 Tokens = **$${(tokenPrice * 10).toLocaleString()}**`,
                inline: false
            })
            .setTimestamp();

        const Buy_1 = new ButtonBuilder().setCustomId("buy1").setLabel("Buy 1").setStyle("Primary");

        const Buy_10 = new ButtonBuilder().setCustomId("buy10").setLabel("Buy 10").setStyle("Primary");

        const row = new ActionRowBuilder().addComponents(Buy_1, Buy_10);

        const shopMessage = await interaction.reply({
            embeds: [tokenShop],
            components: [row]
        });

        const collection = shopMessage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collection.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                await interaction.reply("This is not your message");
                return;
            }

            switch (i.customId) {
                case "buy1":
                    if (user.balance < tokenPrice) {
                        await interaction.reply("You don't have enough money to buy token");
                        return;
                    }

                    user.balance -= tokenPrice;
                    user.token += 1;

                    await user.save();

                    const successBuy1Message = `Complete bought **1** token\nNow you have **${user.token}** tokens`;

                    await interaction.editReply({ content: successBuy1Message, embeds: [] });
                    collection.stop();
                    break;

                case "buy10":
                    if (user.balance < tokenPrice) {
                        await interaction.reply("You don't have enough to buy token");
                        return;
                    }

                    user.balance -= 50000000;
                    user.token += 10;

                    await user.save();

                    const successBuy10Message = `Complete bought **10** tokens\nNow you have **${user.token}** tokens`;

                    await interaction.editReply({ content: successBuy10Message, embeds: [] });
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
