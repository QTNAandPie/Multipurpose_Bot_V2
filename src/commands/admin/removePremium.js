const { ApplicationCommandOptionType } = require("discord.js");
const { ownerId } = require("../../../config.json");
const Premium = require("../../schemas/premium-user");

function AdminOrOwner(userId) {
	const AdminOrOwner = ownerId;
	return AdminOrOwner.includes(userId);
}

module.exports = {
	data: {
		name: "removepremium",
		description: "Remove the premium user",
		options: [
			{
				name: "target-user",
				description: "The user want to remove",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
		],
	},

	run: async ({ interaction, client }) => {
		if (!AdminOrOwner(interaction.user.id)) {
			return interaction.reply({
				content: "You don't have permission to use this command.",
				ephemeral: true,
			});
		}

		const member = interaction.options.getUser("target-user");

		const premiumUser = await Premium.findOne({ userId: interaction.member.id });

		if (premiumUser.isPremium === false) {
			interaction.reply({
				content: "This user is doesn't have premium to remove",
				ephemeral: true,
			});
			return;
		}

		premiumUser.isPremium = false;
		premiumUser.redeemedBy = [];
		premiumUser.redeemedAt = null;
		premiumUser.expiresAt = null;
		premiumUser.plan = null;

		await premiumUser.save();

		interaction.reply({
			content: `Complete remove premium to ${member.globalName}`,
			ephemeral: true,
		});
	},
};
