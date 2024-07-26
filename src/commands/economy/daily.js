const User = require("../../schemas/user");

module.exports = {
	data: {
		name: "daily",
		description: "Get your daily",
	},

	run: async ({ interaction, client }) => {
		try {
			const query = {
				userId: interaction.member.id,
			};

			const user = await User.findOne(query);

			if (!user) {
				await interaction.reply("You don't have any balance to get daily reward\nPlease type /start to create the balance");
				return;
			}

			const currentDate = new Date().toDateString();

			const lastDailyDate = user.lastDaily?.toDateString();

			if (lastDailyDate === currentDate) {
				await interaction.reply("You have already collected your dailies today. Come back tomorrow!");
				return;
			}

			user.lastDaily = new Date();

			user.balance += user.daily;
			await user.save();

			interaction.reply(`**$${user.daily}** was added to your balance. Your balance now is **$${Math.floor(user.balance).toLocaleString()}**`);

			user.daily = user.daily * 1.05;
			await user.save();
		} catch (error) {
			console.log(error);
		}
	},
};
