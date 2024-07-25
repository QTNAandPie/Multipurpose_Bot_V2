const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const Premium = require("../../../schemas/premium-user");

function capitalizeFirstLetter(str) {
	return str?.charAt(0).toUpperCase() + str?.slice(1);
}

module.exports = {
	data: {
		name: "premium",
		description: "See the premium you have",
	},

	run: async ({ interaction, client }) => {
		const premiumUser = await Premium.findOne({ userId: interaction.user.id });

		if (premiumUser.isPremium === false) {
			await interaction.reply("You don't have any premium to check\nPlease upgrade to premium tier to use this command!");
			return;
		}

		const premiumStatus = new EmbedBuilder()
			.setTitle("Premium status")
			.setColor(0xacffe4)
			.setDescription("Displays the remaining time use the premium package")
			.addFields(
				{
					name: "Planned use",
					value: `${capitalizeFirstLetter(premiumUser?.plan)}`,
					inline: true,
				},
				{
					name: "Time expire",
					value: `${moment(premiumUser.expiresAt).format("YYYY/MM/DD HH:MM:SS")}`,
					inline: true,
				}
			);

		interaction.reply({
			embeds: [premiumStatus],
		});
	},
};
