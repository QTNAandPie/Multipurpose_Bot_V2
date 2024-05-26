const { ApplicationCommandOptionType } = require("discord.js");
const User = require("../../schemas/user");

async function CreateandUpdate(guildId, mentionId) {
    const newUser = await User.findOne({ guildId: guildId, userId: mentionId });
    if (!newUser) {
        const newUserDatabase = new User({
            userId: mentionId,
            guildId: guildId,
            balance: 0,
            bank: 0
        });
        await newUserDatabase.save();
    }
}

module.exports = {
    data: {
        name: "transfer",
        description: "Transfer to someone",
        options: [
            {
                name: "target-user",
                description: "Pick the user to transfer",
                type: ApplicationCommandOptionType.Mentionable,
                required: false
            },
            {
                name: "amount",
                description: "Amount the money to transfer",
                type: ApplicationCommandOptionType.Number,
                required: false
            }
        ]
    },

    run: async ({ interaction, client }) => {
        await interaction.deferReply();

        const amount = interaction.options.getNumber("amount");
        const member = interaction.options.getUser("target-user");

        if (member.id === interaction.user.id) return interaction.editReply("You can't transfer to yourself");

        if (member.bot) return interaction.editReply("You can't transfer to the bot");
        
        await CreateandUpdate(interaction.guild.id, member.id)

        const user = await User.findOne({ guildId: interaction.guild.id, userId: interaction.user.id });
        const targetUser = await User.findOne({ guildId: interaction.guild.id, userId: member.id });

        if (amount > user.balance) return interaction.editReply("You don't have enough money to transfer");

        if (amount < 20 || amount > 500000) return interaction.editReply("You can only transfer from $20 to $500,000");

        const amountTransfer = Number(amount);

        targetUser.balance += amountTransfer;
        user.balance += amountTransfer;

        await targetUser.save();
        await user.save();

        try {
            await interaction.editReply(`You transfer **$${amount}** to ${member}\nYour balance now have **$${user.balance}**`);
        } catch (error) {
            console.log(error)
        }
    }
};
