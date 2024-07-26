const User = require("../../schemas/user");

module.exports = async (interaction, client) => {
	const user = await User.findOne({ userId: interaction.user?.id });

	if (user?.xp > user?.requireXP) {
		user.xp = 0;
		user.level += 1;
		user.requireXP += 175;
	}

	await user?.save().catch((e) => {
		console.log(`Error saving updated level ${e}`);
		return;
	});
};
