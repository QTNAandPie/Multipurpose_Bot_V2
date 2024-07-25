const { Schema, model } = require("mongoose");

const codeSchema = new Schema({
	code: {
		type: "String",
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
});

module.exports = model("Code", codeSchema);
