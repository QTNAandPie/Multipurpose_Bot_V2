const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");
const { ownerId } = require("../../../config.json");

function AdminOrOwner(userId) {
	const AdminOrOwner = ownerId;
	return AdminOrOwner.includes(userId);
}

module.exports = {
	data: {
		name: "addbal",
		description: "Add money from user balance",
		options: [
			{
				name: "user",
				description: "Type the username",
				type: ApplicationCommandOptionType.User,
				required: true,
			},
			{
				name: "amount",
				description: "Amount the money add to user",
				type: ApplicationCommandOptionType.Number,
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

		const amount = interaction.options.getNumber("amount");
		const member = interaction.options.getUser("user");

		const user = await User.findOne({ userId: interaction.member.id });

		if (!user) {
			return interaction.reply({
				content: "User not found",
				ephemeral: true,
			});
		}

		user.balance += amount;

		await user.save();

		interaction.reply({
			content: `You added **$${amount.toLocaleString()}** to <${member}>`,
			ephemeral: true,
		});
	},
};
