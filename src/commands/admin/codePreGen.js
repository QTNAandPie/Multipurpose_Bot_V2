const voucher_code_generator = require("voucher-code-generator");
const moment = require("moment");
const Code = require("../../schemas/code-gen");
const { ownerId } = require("../../../config.json");
const { ApplicationCommandOptionType } = require("discord.js");

function AdminOrOwner(userId) {
	const AdminOrOwner = ownerId;
	return AdminOrOwner.includes(userId);
}

module.exports = {
	data: {
		name: "generatepremiumcode",
		description: "Generate the premium code",
		options: [
			{
				name: "plan",
				description: "Select the plan to generate (Daily, weekly, monthly, yearly)",
				type: ApplicationCommandOptionType.String,
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

		const plan = interaction.options.getString("plan") || "monthly";

		let time;

		if (plan === "daily") time = Date.now() + 86400000;
		if (plan === "weekly") time = Date.now() + 86400000 * 7;
		if (plan === "monthly") time = Date.now() + 86400000 * 30;
		if (plan === "yearly") time = Date.now() + 86400000 * 365;

		const codePremium = voucher_code_generator.generate({
			pattern: "##########",
		});

		const code = codePremium.toString();

		const findCode = await Code.findOne({ code: code });

		if (!findCode) {
			const newCode = new Code({
				code: code,
				plan: plan,
				expiresAt: time,
			});

			await newCode.save();
		}

		interaction.reply({
			content: `Complete generate premium code\nNew ${plan} premium code is : ${code}\nTo redeem this code, use /redeem to get this.`,

			ephemeral: true,
		});
	},
};
