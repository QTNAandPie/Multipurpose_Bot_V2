const { EmbedBuilder } = require("discord.js");
const Cooldown = require("../../schemas/actions/mine-cooldown");
const Upgrade = require("../../schemas/actions/upgrade_actions");
const User = require("../../schemas/user");

function getRandomXP(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: {
		name: "mine",
		description: "Mine to get money",
	},

	run: async ({ interaction, client }) => {
		const xpToGive = getRandomXP(5, 10);

		let cooldown = await Cooldown.findOne({ userId: interaction.user.id });
		let upgrade = await Upgrade.findOne({ userId: interaction.user.id });
		const user = await User.findOne({ userId: interaction.user.id });

		if (!user) {
			await interaction.reply("Look like you don't have balance before.\nPlease type /start to create balance");
			return;
		}

		if (cooldown && Date.now() < cooldown.mine.endAt) {
			const { default: prettyMs } = await import("pretty-ms");

			await interaction.reply(`This command is cooldown, come back after ${prettyMs(cooldown.mine.endAt - Date.now())}`);
			return;
		}

		if (!cooldown) {
			cooldown = new Cooldown({
				userId: interaction.user.id,
			});
		}

		if (!upgrade) {
			upgrade = new Upgrade({
				userId: interaction.user.id,
			});
		}

		const baseMineEarn = 50000;

		const level_boost = 1 + user.level * 0.1;

		const mine_boost = 1 + upgrade.upgrade.mine.boost * 0.1;

		const effeciency_boost = 1 + upgrade.upgrade.effeciency.boost * 0.01;

		user.xp += xpToGive;

		await user.save().catch((e) => {
			console.log(`Error saving updated level ${e}`);
			return;
		});

		user.balance = user.balance + baseMineEarn * (level_boost + mine_boost + effeciency_boost);
		cooldown.mine.endAt = Date.now() + 120000;

		await Promise.all([cooldown.save(), user.save()]);

		try {
			const mineEmbed = new EmbedBuilder()
				.setTitle("Mine result")
				.setColor(0xff39be)
				.addFields(
					{
						name: "You got",
						value: `**$${Math.floor(baseMineEarn * (level_boost + mine_boost + effeciency_boost))}**`,
						inline: false,
					},
					{
						name: "XP Earn",
						value: `${xpToGive} XP`,
						inline: false,
					}
				)
				.setFooter({ text: "The command is cooldown in 2m left" })
				.setTimestamp();

			await interaction.reply({ embeds: [mineEmbed] });
		} catch (error) {
			console.log("Failed running command\n" + error);
		}
	},
};
