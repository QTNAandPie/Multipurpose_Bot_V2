const User = require("../../schemas/user");
const dailyAmount = 500;

module.exports = {
    data: {
        name: "daily",
        description: "Get your daily"
    },

    run: async ({ interaction, client }) => {
        try {
            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id
            };

            const user = await User.findOne(query);

            if (!user) {
                await interaction.reply("You don't have any balance to get daily reward\nPlease type /start to create the balance");
                return;
            }

            const lastDailyDate = user.lastDaily.toDateString();

            const currentDate = new Date().toDateString();

            if (lastDailyDate === currentDate) {
                await interaction.reply("You have already collected your dailies today. Come back tomorrow!");
                return;
            }

            user.lastDaily = new Date();

            user.balance += dailyAmount;
            await user.save();

            interaction.reply(`$${dailyAmount} was added to your balance. Your balance now is $${user.balance}`);
        } catch (error) {
            console.log(error);
        }
    }
};
