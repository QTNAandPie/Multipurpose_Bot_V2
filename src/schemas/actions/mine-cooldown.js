const { Schema, model } = require("mongoose");

const mineCooldownSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	mine: {
		endAt: {
			type: Date,
			require: true,
		},
	},
});

module.exports = model("Mine", mineCooldownSchema);
