const { Schema, model } = require("mongoose");

const workCooldownSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	work: {
		endAt: {
			type: Date,
			require: true,
		},
	},
});

module.exports = model("Work", workCooldownSchema);
