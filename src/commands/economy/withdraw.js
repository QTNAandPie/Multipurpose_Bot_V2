const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "withdraw",
        description: "Get your money from your bank",
        options: [
            {
                name: "amount",
                description: "Amount the money to your balance",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },

    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
        }

        try {
            const amount = interaction.options.getNumber("amount");

            await interaction.deferReply();

            const targetUserId = interaction.member.id;

            const user = await User.findOne({
                userId: targetUserId,
                guildId: interaction.guild.id
            });

            if (amount > user.bank) {
                interaction.editReply("You don't have enough money to withdraw");
            }

            const amountWithdraw = Number(amount);

            user.balance += amountWithdraw;
            user.bank -= amountWithdraw;
            await user.save();

            interaction.editReply(`You withdraw **$${amount}** from your bank\nYour bank now have **$${user.bank}**`);
        } catch (error) {
            console.log(error);
        }
    }
};
