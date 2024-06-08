const Premium = require("../../schemas/premium-user");
const { ownerId } = require("../../../config.json");
const { ApplicationCommandOptionType } = require("discord.js");
const moment = require("moment");

function AdminOrOwner(userId) {
    const AdminOrOwner = ownerId;
    return AdminOrOwner.includes(userId);
}

module.exports = {
    data: {
        name: "addpremium",
        description: "Add the premium user",
        options: [
            {
                name: "userid",
                description: "The user want to premium",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "plan",
                description: "Select the plan to give the user",
                type: ApplicationCommandOptionType.String
            }
        ]
    },

    run: async ({ interaction, client }) => {
        if (!AdminOrOwner(interaction.user.id)) {
            return interaction.reply({
                content: "You don't have permission to use this command.",
                ephemeral: true
            });
        }

        const member = interaction.options.getString("userid");
        const plan = interaction.options.getString("plan") || "monthly";

        let time;

        if (plan === "daily") time = Date.now() + 86400000;
        if (plan === "weekly") time = Date.now() + 86400000 * 7;
        if (plan === "monthly") time = Date.now() + 86400000 * 30;
        if (plan === "yearly") time = Date.now() + 86400000 * 365;

        const premiumUser = await Premium.findOne({ userId: member, guildId: interaction.guild.id });

        if (premiumUser?.isPremium === true) {
            await interaction.reply({
                content: `This user has already gain the premium tier`,
                ephemeral: true
            });
            return;
        }

        if (!premiumUser) {
            const newPremium = new Premium({
                userId: interaction.member.id,
                guildId: interaction.guild.id,
                isPremium: true,
                redeemAt: Date.now(),
                expiresAt: time,
                redeemedBy: [{ userId: interaction.user.id, userTag: interaction.user.tag }],
                plan: plan
            });

            await newPremium.save();

            interaction.reply({
                content: `
                    Complete add premium to <@${member}> have ${plan} planned.\n
Expires at ${moment(time).format("YYYY-MM-DD HH:MM:SS")}
                    `,
                ephemeral: true
            });

            return;
        }

        premiumUser.isPremium = true;
        premiumUser.redeemedBy.push({
            userId: interaction.user.id,
            userTag: interaction.user.tag
        });
        premiumUser.redeemedAt = Date.now();
        premiumUser.expiresAt = time;
        premiumUser.plan = plan;

        await premiumUser.save();

        interaction.reply({
            content: `
                Complete add premium to ${member} have ${plan} planned.\n
                Expires at ${moment(time).format("YYYY-MM-DD HH:MM:SS")}
                `,
            ephemeral: true
        });
    }
};
