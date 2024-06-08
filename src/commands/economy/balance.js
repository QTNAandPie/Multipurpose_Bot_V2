const { EmbedBuilder } = require("discord.js");
const User = require("../../schemas/user");
const Premium = require("../../schemas/premium-user");

module.exports = {
    data: {
        name: "balance",
        description: "See your balance"
    },

    run: async ({ interaction, client }) => {
        const hasUser = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        const premiumUser = await Premium.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

        if (!hasUser) {
            await interaction.reply("You don't have any balance show.\nType /start to create balance");
            return;
        }

        if (premiumUser?.isPremium === true) {
            const balanceEmbeds = new EmbedBuilder()
                .setTitle(`${interaction.user.globalName} Balance`)
                .setDescription("> Premium Tier")
                .setColor(0xc3f4ff)
                .addFields(
                    {
                        name: "Balance",
                        value: `**$${hasUser.balance.toLocaleString()}**`,
                        inline: true
                    },
                    {
                        name: "Bank",
                        value: `**$${hasUser.bank.toLocaleString()}**`,
                        inline: true
                    },
                    {
                        name: "Token",
                        value: `**${hasUser.token.toLocaleString()}**`,
                        inline: true
                    },
                    {
                        name: "XP",
                        value: `${hasUser.xp}/${hasUser.requireXP} (Level: ${hasUser.level})`,
                        inline: false
                    }
                )
                .setTimestamp();

            await interaction.reply({
                embeds: [balanceEmbeds]
            });
            return;
        }

        const balanceEmbeds = new EmbedBuilder()
            .setTitle(`${interaction.user.globalName} Balance`)
            .setDescription("> Free Tier")
            .setColor(0xc3f4ff)
            .addFields(
                {
                    name: "Balance",
                    value: `**$${hasUser.balance.toLocaleString()}**`,
                    inline: true
                },
                {
                    name: "Bank",
                    value: `**$${hasUser.bank.toLocaleString()}**`,
                    inline: true
                },
                {
                    name: "Token",
                    value: `**${hasUser.token.toLocaleString()}**`,
                    inline: true
                },
                {
                    name: "XP",
                    value: `${hasUser.xp}/${hasUser.requireXP} (Level: ${hasUser.level})`,
                    inline: false
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [balanceEmbeds]
        });
    }
};
