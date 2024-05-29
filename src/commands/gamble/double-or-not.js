const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

function randomArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
}

module.exports = {
    data: {
        name: "double-or-not",
        description: "Insert your balance to try get double up or nothing",
        options: [
            {
                name: "amount",
                description: "The amount you want to try",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },

    run: async ({ interaction, client }) => {
        try {
            const amount = interaction.options.getNumber("amount");

            let user = await User.findOne({
                userId: interaction.user.id
            });

            if (amount < 50) {
                await interaction.reply("You must insert at least $50");
                return;
            }

            if (amount > user.balance) {
                await interaction.reply("You don't have enough balance to insert");
                return;
            }

            let loseReplyString = ["Oh, your luck so bad. Try again if you can show your luck", "What the bad luck here? You lose there :<"];

            const randomLoseString = randomArray(loseReplyString);

            const didWin = Math.random() > 0.5; // Like 50/50

            if (!didWin) {
                user.balance -= amount;
                await user.save();

                await interaction.reply(`${randomLoseString}`);
                return;
            }

            const amountWon = Number(amount);

            user.balance += amountWon;
            await user.save();

            interaction.reply(`WooW, you won **+$${amountWon}**!.\nYour balance now is: **$${user.balance}**`);
        } catch (error) {
            console.log("Failed to play" + error);
            interaction.reply("Failed to play");
        }
    }
};
