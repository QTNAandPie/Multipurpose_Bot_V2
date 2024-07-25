const { ActivityType } = require("discord.js");

module.exports = (client) => {
	let status = [
		{
			name: "Github",
			type: ActivityType.Watching,
		},
		{
			name: "JSCode Edition",
			type: ActivityType.Playing,
		},
	];

	console.log(`${client.user.username} | Status : Connected`);

	setInterval(() => {
		let random = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[random]);
	}, 10000);
};
