const { Schema, model } = require("mongoose");

const upgradeSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},

	upgrade: {
		mine: {
			boost: {
				type: Number,
				default: 0,
			},

			cost: {
				type: Number,
				default: 150000,
			},
		},

		work: {
			boost: {
				type: Number,
				default: 0,
			},

			cost: {
				type: Number,
				default: 750000,
			},
		},

		efficiency: {
			boost: {
				type: Number,
				default: 0,
			},

			cost: {
				type: Number,
				default: 150,
			},
		},
	},
});

module.exports = model("Upgrade", upgradeSchema);
