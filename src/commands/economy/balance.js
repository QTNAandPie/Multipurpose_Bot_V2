const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "balance",
        description: "See your balance"
    },

    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        try {
            const targetUserId = interaction.member.id;

            await interaction.deferReply();

            const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

            if (!user) {
                interaction.editReply(`<@${targetUserId}> doesn't have a profile yet.`);
                return;
            }

            interaction.editReply(`Your balance is **$${user.balance}**\nYour bank is **$${user.bank}**`);
        } catch (error) {
            console.log(error);
        }
    }
};
