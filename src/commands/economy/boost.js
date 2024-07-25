const { EmbedBuilder } = require("discord.js");
const Upgrade = require('../../schemas/actions/upgrade_actions')
const User = require("../../schemas/user");

module.exports = {
	data: {
		name: "boost-economy",
		description: "See the boost from economy action",
	},

	run: async ({ interaction, client }) => {
		const user = await User.findOne({ userId: interaction.user.id });
		let upgrade = await Upgrade.findOne({ userId : interaction.user.id })

		if (!upgrade) {
			upgrade = new Upgrade({
				userId: interaction.user.id,
			});
		}

		const level_boost = user.level * 10;

		const boostEmbed = new EmbedBuilder()
			.setTitle("Boost status")
			.setColor(0x86469C)
			.setDescription(`Level boost: ${Math.floor(level_boost).toLocaleString()}%\nMine boost: ${Math.floor(upgrade.upgrade.mine.boost).toLocaleString()}%\nWork boost: ${Math.floor(upgrade.upgrade.work.boost).toLocaleString()}%\nEffeciency boost: x${Math.floor(1 + upgrade.upgrade.effeciency.boost * 0.01).toLocaleString()}\nComing soon...`)
			.setTimestamp();
		interaction.reply({ embeds: [boostEmbed] });
	},
};
