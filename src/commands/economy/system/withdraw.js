const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../../schemas/user");

module.exports = {
	data: {
		name: "withdraw",
		description: "Get your money from your bank",
		options: [
			{
				name: "amount",
				description: "Amount the money to your balance",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
		],
	},

	run: async ({ interaction, client }) => {
		try {
			const amount = interaction.options.getNumber("amount");

			const user = await User.findOne({ userId: interaction.user.id });

			if (amount > user.bank) {
				await interaction.reply("You don't have enough money to withdraw");
				return;
			}

			const amountWithdraw = Number(amount);

			user.balance += amountWithdraw;
			user.bank -= amountWithdraw;

			await user.save();

			interaction.reply(`You withdraw **$${amount}** from your bank\nNow your bank have **$${user.bank.toLocaleString()}**`);
		} catch (error) {
			interaction.reply("Failed to withdraw. Please try again");
			console.log("Failed to withdraw" + error);
		}
	},
};
