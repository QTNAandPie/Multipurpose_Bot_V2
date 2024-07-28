const { EmbedBuilder } = require("discord.js");
const Premium = require("../../../schemas/premium-user");
const User = require("../../../schemas/user");

module.exports = {
	data: {
		name: "premium-daily",
		description: "The daily reward for premium member",
	},

	run: async ({ interaction, client }) => {
		const premium = await Premium.findOne({ userId: interaction.user.id });
		const user = await User.findOne({ userId: interaction.user.id });

		if (premium.isPremium === false) {
			await interaction.reply("This command only for premium member\nPlease upgrade to premium tier to use this command!");
			return;
		}

		if (!user) {
			await interaction.reply("You don't have any balance to get premium daily reward\nPlease type /start to create the balance");
			return;
		}

		const currentDate = new Date().toDateString();

		const lastPremiumDailyDate = premium.lastPremiumDaily?.toDateString();

		if (lastPremiumDailyDate === currentDate) {
			await interaction.reply("You have already collected your premium dailies today. Come back tomorrow!");
			return;
		}

		premium.lastPremiumDaily = new Date();

		user.balance += user.daily * (1 + user.level * 0.1);
		user.token += 45 * (1 + user.level * 0.1);

		await user.save();

        const premiumDailyEmbed = new EmbedBuilder()
            .setTitle("Premium daily earn")
            .setColor(0x7FABDE)
            .addFields(
                {
                    name : "Money",
                    value : `**$${Math.floor(user.daily * (1 + user.level * 0.1)).toLocaleString()}**`,
                    inline : true
                },
                {
                    name : "Token",
                    value : `**${Math.floor(45 * (1 + user.level * 0.1)).toLocaleString()}** Tokens`
                },
            )
            .setFooter({text : "Comeback in 24H"})
		interaction.reply(
			{
                embeds : [premiumDailyEmbed]
            }
		);
	},
};
