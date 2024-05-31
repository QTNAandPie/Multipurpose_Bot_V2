const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");
const { ownerId } = require("../../../config.json");

function AdminOrOwner(userId) {
    const AdminOrOwner = ownerId;
    return AdminOrOwner.includes(userId);
}

module.exports = {
    data: {
        name: "deductbal",
        description: "Deduct money from user balance",
        options: [
            {
                name: "target-user",
                description: "The user want to deduct",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "amount",
                description: "Amount the money to deduct",
                type: ApplicationCommandOptionType.Number,
                required: true
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

        const amount = interaction.options.getNumber("amount");
        const member = interaction.options.getUser("target-user");

        const targetUser = await User.findOne({ userId: member.id, guildId: interaction.guild.id });

        if (!targetUser) {
            await interaction.reply({
                content: `"This user not found or may be a bot"`,
                ephemeral: true
            });
            return;
        }

        if (targetUser.balance < amount) {
            await interaction.reply({
                content: `Since this user have balance lower than your amount to deduct\nSo this user immediately have **$0** from user balance`,
                ephemeral: true
            });

            targetUser.balance = 0;

            await targetUser.save();
            return;
        }

        targetUser.balance -= amount;

        await targetUser.save();

        interaction.reply({
            content: `Deduct **$${amount.toLocaleString()}** to user ${member}`,
            ephemeral: true
        });
    }
};
