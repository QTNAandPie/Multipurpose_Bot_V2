const { EmbedBuilder } = require("discord.js");
const Cooldown = require("../../schemas/actions/work-cooldown");
const Upgrade = require("../../schemas/actions/upgrade_actions");
const User = require("../../schemas/user");

function getRandomNumber(x, y) {
	const range = y - x + 1;
	const randomNumber = Math.floor(Math.random() * range);
	return randomNumber + x;
}

function getRandomXP(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	data: {
		name: "work",
		description: "Get money by work",
	},

	run: async ({ interaction, client }) => {
		const xpToGive = getRandomXP(20, 45);

		let cooldown = await Cooldown.findOne({ userId: interaction.user.id });
		let upgrade = await Upgrade.findOne({ userId: interaction.user.id });
		const user = await User.findOne({ userId: interaction.user.id });

		if (!user) {
			await interaction.reply("Look like you don't have balance before.\nPlease type /start to create balance");
			return;
		}

		if (cooldown && Date.now() < cooldown.work.endAt) {
			const { default: prettyMs } = await import("pretty-ms");

			await interaction.reply(`This command is cooldown, come back after ${prettyMs(cooldown.work.endAt - Date.now())}`);
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

		const earnMoney = getRandomNumber(100000, 700000);

		const level_boost = 1 + user.level * 0.1;

		const work_boost = 1 + upgrade.upgrade.work.boost * 0.1;

		const effeciency_boost = 1 + upgrade.upgrade.effeciency.boost * 0.01;

		user.xp += xpToGive;

		user.balance = user.balance + earnMoney * (level_boost + work_boost + effeciency_boost);
		cooldown.work.endAt = Date.now() + 3600000;

		await Promise.all([cooldown.save(), user.save()]);
		
		if (user.xp > user.requireXP) {
			user.xp = 0;
			user.level += 1;
			user.requireXP += 175;
		}
	
		await user.save().catch((e) => {
			console.log(`Error saving updated level ${e}`);
			return;
		});

		try {
			const workEmbed = new EmbedBuilder()
				.setTitle("Work result")
				.setColor(0xff39be)
				.addFields(
					{
						name: "You got",
						value: `**$${Math.floor(earnMoney * (level_boost + work_boost + effeciency_boost)).toLocaleString()}**`,
						inline: false,
					},
					{
						name: "XP Earn",
						value: `${xpToGive} XP`,
						inline: false,
					}
				)
				.setFooter({ text: "The command is cooldown in 60m left" })
				.setTimestamp();

			await interaction.reply({ embeds: [workEmbed] });
		} catch (error) {
			console.log("Failed running command\n" + error);
		}
	},
};
