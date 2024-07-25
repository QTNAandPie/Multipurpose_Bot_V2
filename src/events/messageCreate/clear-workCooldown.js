const Cooldown = require("../../schemas/actions/work-cooldown");

module.exports = () => {
	setInterval(async () => {
		try {
			const cooldowns = await Cooldown.find().select("endAt");

			for (const cooldown of cooldowns) {
				if (Date.now() < cooldown.work.endAt) return;

				await cooldown.deleteOne({ work: { endAt: Date.now() } });
			}
		} catch (error) {
			console.log("Failed clear cooldown");
		}
	}, 3.6e6);
};
