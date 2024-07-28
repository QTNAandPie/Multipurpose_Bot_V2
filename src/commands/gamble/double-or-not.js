const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

function randomArray(arr) {
	const randomIndex = Math.floor(Math.random() * arr.length);
	const item = arr[randomIndex];
	return item;
}

function getRandomXP(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: {
		name: "double-or-not",
		description: "Insert your balance to try get double up or nothing",
		options: [
			{
				name: "amount",
				description: "The amount you want to try",
				type: ApplicationCommandOptionType.Number,
				required: true,
			},
		],
	},

	run: async ({ interaction, client }) => {
		try {
			const xpToGive = getRandomXP(1, 3);

			const amount = interaction.options.getNumber("amount");

			const user = await User.findOne({
				userId: interaction.user.id,
			});

			if (!user) {
				await interaction.reply("You doesn't have a balance to gambling\nType /start to create");
			}

			if (amount < 50) {
				await interaction.reply("You must insert at least $50");
				return;
			}

			if (amount > user.balance) {
				await interaction.reply("You don't have enough balance to insert");
				return;
			}

			let loseReplyString = ["Oh, your luck so bad. Try again if you can show your luck", "What the bad luck here? You lose there :<"];

			const randomLoseString = randomArray(loseReplyString);

			const didWin = Math.random() > 0.5; // Like 50/50

			if (!didWin) {
				user.balance -= amount;
				await user.save();

				await interaction.reply(`${randomLoseString}`);
				return;
			}

			const amountWon = Number(amount);

			user.xp += xpToGive;

			user.balance += amountWon;
			await user.save();

			if (user.xp > user.requireXP) {
				user.xp = 0;
				user.level += 1;
				user.requireXP += 175;
			}
		
			await user.save().catch((e) => {
				console.log(`Error saving updated level ${e}`);
				return;
			});

			interaction.reply(`WooW, you won **+$${amountWon.toLocaleString()}**! And you got **${xpToGive} XP**.\nYour balance now is: **$${user.balance.toLocaleString()}**`);
		} catch (error) {
			console.log(error);
		}
	},
};
