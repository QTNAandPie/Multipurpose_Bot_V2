const { EmbedBuilder } = require("discord.js");
const User = require("../../schemas/user");
const Premium = require("../../schemas/premium-user");

module.exports = {
	data: {
		name: "balance",
		description: "See your balance",
	},

	run: async ({ interaction, client }) => {
		const hasUser = await User.findOne({ userId: interaction.user.id });
		const premiumUser = await Premium.findOne({ userId: interaction.user.id });

		if (!hasUser) {
			await interaction.reply("You don't have any balance show.\nType /start to create balance");
			return;
		}

		const PremiumDetect = () => {
			const hasPremium = premiumUser?.isPremium;

			if (hasPremium === true) return "Premium Tier";
			else return "Free Tier";
		};

		const balanceEmbeds = new EmbedBuilder()
			.setTitle(`${interaction.user.globalName} Balance`)
			.setDescription(`> ${PremiumDetect()}`)
			.setColor(0xc3f4ff)
			.addFields(
				{
					name: "Balance",
					value: `**$${Math.floor(hasUser.balance).toLocaleString()}**`,
					inline: true,
				},
				{
					name: "Bank",
					value: `**$${Math.floor(hasUser.bank).toLocaleString()}**`,
					inline: true,
				},
				{
					name: "Token",
					value: `**${hasUser.token.toLocaleString()}**`,
					inline: true,
				},
				{
					name: "XP",
					value: `${hasUser.xp}/${hasUser.requireXP} (Level: ${hasUser.level})`,
					inline: false,
				}
			)
			.setTimestamp();

		await interaction.reply({
			embeds: [balanceEmbeds],
		});
	},
};
