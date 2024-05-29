const { EmbedBuilder } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "balance",
        description: "See your balance"
    },

    run: async ({ interaction, client }) => {
        try {
            const hasUser = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

            if (!hasUser) {
                await interaction.reply("You don't have any balance show.\nType /start to create balance");
                return;
            }

            const balanceEmbeds = new EmbedBuilder()
                .setTitle(`${interaction.user.globalName} Balance`)
                .setColor(0xc3f4ff)
                .addFields(
                    {
                        name: "Balance",
                        value: `**$${hasUser.balance.toLocaleString()}**`,
                        inline: false
                    },
                    {
                        name: "Bank",
                        value: `**$${hasUser.bank.toLocaleString()}**`,
                        inline: false
                    }
                )
                .setTimestamp();

            interaction.reply({
                embeds: [balanceEmbeds]
            });
        } catch (error) {
            console.log("Failed to show balance" + error);
            interaction.reply("Failed to show balance");
        }
    }
};
