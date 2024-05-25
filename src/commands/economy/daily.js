const User = require("../../schemas/user");
const dailyAmount = 500;

module.exports = {
    data: {
        name: "daily",
        description: "Get your daily"
    },

    run: async ({ interaction, client }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        await interaction.deferReply();

        try {
            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id
            };

            let user = await User.findOne(query);

            if (user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    interaction.editReply("You have already collected your dailies today. Come back tomorrow!");
                    return;
                }

                user.lastDaily = new Date();
            } else {
                user = new User({
                    ...query,
                    lastDaily: new Date()
                });
            }

            user.balance += dailyAmount;
            await user.save();

            interaction.editReply(`$${dailyAmount} was added to your balance. Your balance now is $${user.balance}`);
        } catch (error) {
            interaction.editReply("Failed to run this commands. Please try again");
            console.log(error);
        }
    }
};
