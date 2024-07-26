const { EmbedBuilder } = require("discord.js");
const Work = require("../../schemas/actions/work-cooldown");
const Mine = require("../../schemas/actions/mine-cooldown");

module.exports = {
	data: {
		name: "actionstatus",
		description: "See your action",
	},

	run: async ({ interaction, client }) => {
		let workCooldown = await Work.findOne({ userId: interaction.user.id });
		let mineCooldown = await Mine.findOne({ userId: interaction.user.id });

		if (!workCooldown) {
			workCooldown = new Work({
				userId: interaction.user.id,
				work: {
					endAt: Date(),
				},
			});

			await workCooldown.save();
		}

		if (!mineCooldown) {
			mineCooldown = new Mine({
				userId: interaction.user.id,
				mine: {
					endAt: Date(),
				},
			});

			await mineCooldown.save();
		}

		const { default: prettyMs } = await import("pretty-ms");

		const workCooldowns = prettyMs(workCooldown.work.endAt - Date.now());
		const mineCooldowns = prettyMs(mineCooldown.mine.endAt - Date.now());

		if (!workCooldowns || !mineCooldown) return interaction.reply("Problem to progress action");

		const workActionCooldown = () => {
			if (workCooldown.work.endAt > Date.now()) return workCooldowns;

			if (workCooldown.work.endAt <= Date.now()) return "**Ready!!**";
		};

		const mineActionCooldown = () => {
			if (mineCooldown.mine.endAt > Date.now()) return mineCooldowns;

			if (mineCooldown.mine.endAt <= Date.now()) return "**Ready!!**";
		};

		const statusEmbed = new EmbedBuilder()
			.setTitle("Action Status")
			.setColor(0x5eff99)
			.addFields(
				{
					name: "Work",
					value: `${workActionCooldown()}`,
					inline: false,
				},
				{
					name: "Mine",
					value: `${mineActionCooldown()}`,
					inline: false,
				}
			)
			.setFooter({ text: "After action is complete cooldown. You can use /(name of action) to run action" });

		interaction.reply({ embeds: [statusEmbed] });
	},
};
