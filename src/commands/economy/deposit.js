const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "deposit",
        description: "Add your money to your bank",
        options: [
            {
                name: "amount",
                description: "Amount the money to bank",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },

    run: async ({ interaction, client }) => {
        try {
            const amount = interaction.options.getNumber("amount");

            const user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });

            if (amount < 5000) {
                await interaction.reply("You must deposit at least $5000");
                return;
            }

            if (amount > user.balance) {
                await interaction.reply("You don't have enough money to deposit");
                return;
            }

            const amountDeposit = Number(amount);

            user.balance -= amountDeposit;
            user.bank += amountDeposit;

            await user.save();

            interaction.reply(`You deposit **$${amount.toLocaleString()}** to your bank.\nNow your bank have **$${user.bank.toLocaleString()}**`);
        } catch (error) {
            interaction.reply("Failed to deposit. Please try again");
            console.log("Failed to deposit" + error);
        }
    }
};
