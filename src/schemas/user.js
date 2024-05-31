const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    lastDaily: {
        type: Date,
        reqired: true
    },
    bank: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    requireLevel: {
        type: Number,
        default: 100
    }
});

module.exports = model("User", userSchema);
