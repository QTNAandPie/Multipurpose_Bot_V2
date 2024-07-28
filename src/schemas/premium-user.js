const { Schema, model } = require("mongoose");

const premiumSchema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	isPremium: {
		type: Boolean,
		default: false,
	},
	guildId: {
		type: String,
		require: true,
	},
	redeemedBy: {
		type: Array,
		default: null,
	},
	redeemedAt: {
		type: Number,
		default: null,
	},
	expiresAt: {
		type: Number,
		default: null,
	},
	plan: {
		type: String,
		default: null,
	},
	lastPremiumDaily: {
		type: Date,
		default: null,
	},
});

module.exports = model("Premium", premiumSchema);
