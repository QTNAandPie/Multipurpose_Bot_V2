const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	balance: {
		type: Number,
		default: 0,
	},
	daily: {
		type: Number,
		default: 50000,
	},
	lastDaily: {
		type: Date,
		reqired: true,
	},
	bank: {
		type: Number,
		default: 0,
	},
	token: {
		type: Number,
		default: 0,
	},
	xp: {
		type: Number,
		default: 0,
	},
	level: {
		type: Number,
		default: 1,
	},
	requireXP: {
		type: Number,
		default: 100,
	},
});

module.exports = model("User", userSchema);
