const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");
const { ownerId } = require("../../../config.json");

function AdminOrOwner(userId) {
	const AdminOrOwner = ownerId;
	return AdminOrOwner.includes(userId);
}

module.exports = {
	data: {
		name: "addtoken",
		description: "Add money from user balance",
		options: [
			{
				name: "userid",
				description: "Get user from ID",
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: "amount",
				description: "Amount the token add to user",
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
		const member = interaction.options.getString("userid");

		const user = await User.findOne({ userId: interaction.member.id });

		if (!user) {
			return interaction.reply({
				content: "User not found",
				ephemeral: true,
			});
		}

		user.token += amount;

		await user.save();

		interaction.reply({
			content: `You added **${amount.toLocaleString()}** tokens to <@${member}>`,
			ephemeral: true,
		});
	},
};
