const moment = require("moment");
const Code = require("../../schemas/code-gen");
const Premium = require("../../schemas/premium-user");

const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    data: {
        name: "redeem",
        description: "Redeem premium code",
        options: [
            {
                name: "code",
                description: "Put your premium code here (The code to redeem is XXXXXXXXXX)",
                type: ApplicationCommandOptionType.String
            }
        ]
    },

    run: async ({ interaction, client }) => {
        const code = interaction.options.getString("code");

        const findCode = await Code.findOne({ code: code });
        const premiumUser = await Premium.findOne({ userId: interaction.member.id, guildId: interaction.guild.id });

        if (!code) {
            interaction.reply({
                content: "Don't put the blank code!\nUse the specify code you want to redeem.",
                ephemeral: true
            });
            return;
        }

        if (premiumUser?.isPremium == true) {
            await interaction.reply({
                content: "You already are a premium tier.",
                ephemeral: true
            });
            return;
        }

        if (findCode) {
            const expires = moment(findCode.expiresAt).format("DD/MM/YYYY HH:MM:SS");

            premiumUser.isPremium = true;
            premiumUser.redeemedBy.push({
                userId: interaction.user.id,
                userTag: interaction.user.tag
            });
            premiumUser.redeemedAt = Date.now();
            premiumUser.expiresAt = findCode.expiresAt;
            premiumUser.plan = findCode.plan;

            await premiumUser.save();

            await findCode.deleteOne({ code: code }); // One-time gift code

            interaction.reply({
                content: `
                    Successfully redeem! You can access the premium feature here.\nExpires at ${expires}`,
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: "The code you type is invaild! Please try again.",
                ephemeral: true
            });
        }
    }
};
