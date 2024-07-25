const User = require("../../schemas/user");
const Upgrade = require("../../schemas/actions/upgrade_actions");
const Premium = require("../../schemas/premium-user")
const { EmbedBuilder, ButtonBuilder, ComponentType, ActionRowBuilder } = require("discord.js");

module.exports = {
	data: {
		name: "upgrade",
		description: "Upgrade your action",
	},

	run: async ({ interaction, client }) => {
		const user = await User.findOne({ userId: interaction.user.id });
		const premiumUser = await Premium.findOne({ userId: interaction.user.id });
		let upgrade = await Upgrade.findOne({ userId: interaction.user.id });

		if (!user) {
			interaction.reply("you don't have balance to upgrade.\nPlease type /start to create balance");
			return;
		}

		if (!upgrade) {
			upgrade = new Upgrade({
				userId: interaction.user.id,
			});
		}

		const path = upgrade.upgrade

		const upgradeEmbed = new EmbedBuilder()
			.setTitle("Upgrade action")
			.setDescription("Upgrade your action to get more money")
			.addFields(
				{
					name : "Work",
					value : `+${Math.floor(path.work.boost + 10).toLocaleString()}% = $**${Math.floor(path.work.cost).toLocaleString()}**`,
					inline : false,
				},
				{
					name : "Mine",
					value : `+${Math.floor(path.mine.boost + 10).toLocaleString()}% = $**${Math.floor(path.mine.cost).toLocaleString()}**`,
					inline : false,
				},
				{
					name : "Effeciency (Premium)",
					value : `+${Math.floor(path.effeciency.boost + 100).toLocaleString()}% = **${Math.floor(path.effeciency.cost).toLocaleString()}** Token`,
					inline : false,
				},
			)

		const WorkButton = new ButtonBuilder().setCustomId("upwork").setLabel("Upgrade Work").setStyle("Primary");

		const MineButton = new ButtonBuilder().setCustomId("upmine").setLabel("Upgrade Mine").setStyle("Primary");

		const EffeciencyButton = new ButtonBuilder().setCustomId("upeffecientcy").setLabel("Upgrade Effecientcy").setStyle("Primary");

		const row = new ActionRowBuilder().addComponents(WorkButton, MineButton, EffeciencyButton);

		const upgradeMessage = await interaction.reply({
			embeds: [upgradeEmbed],
			components: [row],
		});

		const collection = upgradeMessage.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 30000,
		});

		collection.on("collect", async (i) => {
			if (i.user.id !== interaction.user.id) {
				await interaction.editReply("This is not your message");
				return;
			}

			switch (i.customId) {
				case "upwork" : 
					if (user.balance < path.work.cost) {
						await interaction.editReply("You don't have money to upgrade work")
						return
					}

					user.balance -= path.work.cost
					await user.save()

					path.work.boost += 10
					path.work.cost *= 1.05
					await upgrade.save()

					interaction.editReply({
						embeds : [],
						content : `Complete upgrade work action\nNext upgrade is cost $${Math.floor(path.work.cost).toLocaleString()}`
					})

					collection.stop();
					break;
				
				case "upmine" :
					if (user.balance < path.mine.cost) {
						await interaction.editReply("You don't have money to upgrade mine")
						return
					}

					user.balance -= path.mine.cost
					await user.save()

					path.mine.boost += 10
					path.mine.cost *= 1.05
					await upgrade.save()

					interaction.editReply({
						embeds : [],
						content : `Complete upgrade mine action\nNext upgrade is cost $${Math.floor(path.mine.cost).toLocaleString()}`
					})

					collection.stop();
					break;

				case "upeffecientcy" :
					if (premiumUser.isPremium === false) {
						await interaction.reply("The effeciency upgrade only use for premium tier\nPlease upgrade to premium tier to upgrade your effeciency action!");
						return;
					}

					if (user.token < path.effeciency.cost) {
						await interaction.editReply("You don't have token to upgrade effeciency")
						return
					}

					user.token -= path.effeciency.cost
					await user.save()

					path.effeciency.boost += 100
					path.effeciency.cost *= 1.1
					await upgrade.save()

					interaction.editReply({
						embeds : [],
						content : `Complete upgrade action effeciency\nNext upgrade is cost ${Math.floor(path.effeciency.cost).toLocaleString()} Tokens`
					})

					collection.stop();
					break;
			}
		})

		collection.on("end", (collected) => {
			interaction.editReply({
				embeds: [],
				components: [],
			});
		});
	},
};
