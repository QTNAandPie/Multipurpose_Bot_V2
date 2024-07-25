const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	data: {
		name: "about",
		description: "About the bot",
	},

	run: async ({ client, interaction }) => {
		const button = new ButtonBuilder().setLabel("Bug report").setStyle(ButtonStyle.Link).setURL("https://github.com/WhiteFoxCreamPie/Multipurpose_Bot_V2/issues");
		const row = new ActionRowBuilder().addComponents(button);

		const about = new EmbedBuilder()
			.setColor(0x9c9c9c)
			.setTitle(`About ${client.user.username}`)
			.addFields(
				{
					name: "Information",
					value: `${client.user.username} was created by ${interaction.user.globalName}. This bot make to help server for moderation and make fun for members who using this bot`,
					inline: false,
				},
				{
					name: "Got a bug in bot?",
					value: "Press the 'Bug reports' to help develop fix the bot and improve the experience",
					inline: false,
				}
			)
			.setFooter({ text: `${client.user.username} made by ${interaction.user.globalName}` });

		await interaction.reply({
			embeds: [about],
			components: [row],
		});
	},
};
