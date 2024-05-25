const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "deposit",
        description: "Add your money to your bank",
        options: [
            {
                name: "amount",
                description: "Amount the money to bank",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },

    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
        }

        const amount = interaction.options.getNumber("amount");

        await interaction.deferReply();

        const targetUserId = interaction.member.id;

        const user = await User.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id
        });

        if (amount < 5000) {
            interaction.editReply("You must deposit at least $5000");
            return;
        }

        if (amount > user.balance) {
            interaction.editReply("You don't have enough money to deposit");
        }

        const amountDeposit = Number(amount);

        user.balance -= amountDeposit;
        user.bank += amountDeposit;
        await user.save();

        interaction.editReply(`Your bank now have **$${user.bank}**`);
    }
};
