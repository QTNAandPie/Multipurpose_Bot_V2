const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "transfer",
        description: "Transfer to someone",
        options: [
            {
                name: "target-user",
                description: "Pick the user to transfer",
                type: ApplicationCommandOptionType.Mentionable,
                required: true
            },
            {
                name: "amount",
                description: "Amount the money to transfer",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },

    run: async ({ interaction, client }) => {
        try {
            const amount = interaction.options.getNumber("amount");
            const member = interaction.options.getUser("target-user");

            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
            const targetUser = await User.findOne({ userId: member.id, guildId: interaction.guild.id });

            if (!user) {
                await interaction.reply("You don't have any balance to transfer.\nType /start to create balance");
                return;
            }

            if (!targetUser) {
                await interaction.reply("This user may not created any balance or may be a bot");
                return;
            }

            if (member.id === interaction.user.id) {
                await interaction.reply("You can't transfer to yourself");
                return;
            }

            if (amount > user.balance) {
                await interaction.reply("You don't have enough money to transfer");
                return;
            }

            if (amount < 20 || amount > 500000) {
                await interaction.reply("You can only transfer from $20 to $500,000");
                return;
            }

            const amountTransfer = Number(amount);

            targetUser.balance += amountTransfer;
            user.balance -= amountTransfer;

            await targetUser.save();
            await user.save();

            interaction.reply(`You transfer **$${amount.toLocaleString()}** to ${member}\nYour balance now have **$${user.balance.toLocaleString()}**`);
        } catch (error) {
            console.log("Failed to transfer" + error);
        }
    }
};
