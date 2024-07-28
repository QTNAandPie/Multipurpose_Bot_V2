const { EmbedBuilder } = require('discord.js')
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

			user.balance += user.daily * (1 + user.level * 0.1);
			await user.save();

			const dailyEmbed = new EmbedBuilder()
            .setTitle("Daily earn")
            .setColor(0x7FABDE)
            .addFields(
                {
                    name : "Money",
                    value : `**$${Math.floor(user.daily * (1 + user.level * 0.1)).toLocaleString()}**`,
                    inline : true
                }
            )
            .setFooter({text : "Comeback in 24H"})
		interaction.reply(
			{
                embeds : [dailyEmbed]
            }
		);
		} catch (error) {
			console.log(error);
		}
	},
};
