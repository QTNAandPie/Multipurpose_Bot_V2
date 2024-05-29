const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const User = require("../../schemas/user");

module.exports = {
    data: {
        name: "start",
        description: "Started your economy"
    },

    run: async ({ interaction, client }) => {
        try {
            const existingUser = await User.findOne({ userId: interaction.user.id });

            if (existingUser) {
                await interaction.reply("Your already have a balance");
                return;
            }

            const termsEmbed = new EmbedBuilder()
                .setColor(0x00ff91)
                .setTitle("Term and Service about economy")
                .setDescription(
                    `
                        1. The economy system is base on the ${client.user.username} and can't use the currents
                    balance for different server\n
                        2. The balance is your when you have one. Make sure use the balance correctly and save as
                    much as possible\n
                        3. Don't use the balance for illegal purposes to result violence and brawl in server \n,
                        4. Do not advertise or promote external server, services, products, etc without permission
                    from owner bot even owner server
                        5. Refrain from creating multiple account to exploit the bot feature\n
                        6. Don't do anything against Discord Terms of Service and Community Guidelines or all your\n 
                    actions will not be tolerated
                    `
                )
                .setTimestamp();

            const acceptButton = new ButtonBuilder().setCustomId("accept_terms").setLable("Accept").setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder().addComponents(acceptButton);
            const termsMessage = await interaction.reply({
                embeds: [termsEmbed],
                components: [row]
            });

            const filter = (i) => i.customId === "accept_terms" && i.user.id === interaction;

            const collection = termsMessage.createMessageComponentCollector({
                filter,
                time: 10000
            });

            collection.on("collect", async (interaction) => {
                if (interaction.user.id !== interaction.user.id) {
                    await interaction.reply("This is not your message");
                    return;
                }

                await interaction.update({
                    embeds: [termsEmbed],
                    components: []
                });

                const newUser = new User({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
                    balance: 1000
                });

                await newUser.save();

                const successMessage = "Your account has been created balance and started at **$1,000**";

                await interaction.editReply({ content: successMessage, embeds: [] });
                collection.stop();
            });

            collection.on("end", (collected) => {
                interaction.editReply({
                    embeds: [termsEmbed],
                    components: []
                });
                interaction.followUp("You did not accept the terms within the given time");
            });
        } catch (error) {
            console.log("Failed to start the balance:", error);
            interaction.reply("Failed to start the balance");
        }
    }
};
