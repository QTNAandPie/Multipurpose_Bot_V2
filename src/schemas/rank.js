const { Schema, model } = require("mongoose");

const rankSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    }
});

module.exports = model("Rank", rankSchema);
