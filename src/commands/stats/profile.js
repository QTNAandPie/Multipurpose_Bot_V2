const { EmbedBuilder } = require("@discordjs/builders");
const { ApplicationCommandOptionType } = require("discord.js");
const moment = require("moment");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    data: {
        name: "profile",
        description: "Show your's/someone profile in server",
        options: [
            {
                name: "target-user",
                description: "Show other user profile want to see.",
                type: ApplicationCommandOptionType.Mentionable
            }
        ]
    },

    run: async ({ interaction, client }) => {
        try {
            const user = interaction.options.getUser("target-user") || interaction.user;
            const member = await interaction.guild.members.fetch(user.id);
            const avatarUser = user.displayAvatarURL({ size: 256 });
            const roleMember = member.roles.cache.filter((role) => role.id !== interaction.guild.id).map((role) => role.toString());
            const nickname = member.displayName || "None";

            const profileStatus = new EmbedBuilder()
                .setTitle(`${nickname}'s Profile`)
                .setColor(0x33ccff)
                .setThumbnail(avatarUser)
                .setTimestamp()
                .setFooter({ text: `Username : ${user.username}` })
                .addFields(
                    {
                        name: "Joined Server",
                        value: `${moment.utc(member?.joinedAt).format("DD/MM/YYYY")}`,
                        inline: true
                    },
                    {
                        name: "Joined Discord",
                        value: `${moment.utc(user.createdAt).format("DD/MM/YYYY")}`,
                        inline: true
                    },
                    {
                        name: "Role Server",
                        value: `${roleMember}`,
                        inline: false
                    }
                );

            interaction.reply({ embeds: [profileStatus] });
        } catch (error) {
            interaction.reply("This command may got issue to run. Please try again");
            console.log(error);
        }
    }
};
