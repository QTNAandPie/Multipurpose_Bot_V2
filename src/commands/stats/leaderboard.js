const Rank = require("../../schemas/rank");

module.exports = {
	data: {
		name: "leaderboard",
		description: "Show the leaderboard",
	},

	run: async ({ interaction, client }) => {
		interaction.reply("Coming soonm");
	},
};
