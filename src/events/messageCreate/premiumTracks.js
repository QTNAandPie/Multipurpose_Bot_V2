const { Client, Message } = require("discord.js");
const Premium = require("../../schemas/premium-user");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (message, client) => {
	const userPremium = await Premium.find({ isPremium: true });

	try {
		if (!userPremium.length) return;

		userPremium.forEach(async (premium) => {
			if (Date.now() >= premium.expiresAt) {
				premium.isPremium = false;
				premium.redeemedBy = [];
				premium.redeemedAt = null;
				premium.expiresAt = null;
				premium.plan = null;

				await premium.save();

				message.channel.send("Your premium have been expired");
			}
		});
	} catch (error) {
		console.log("Failed to tracks premium user\n" + error);
	}
};
