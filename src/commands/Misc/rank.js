const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const { Font, RankCardBuilder } = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXP");
const Rank = require("../../schemas/rank");
const calculateLevelXP = require("../../utils/calculateLevelXP");

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    data: {
        name: "rank",
        description: "Show your rank.",
        options: [
            {
                name: "target-user",
                description: "Show other user rank want to see.",
                type: ApplicationCommandOptionType.Mentionable
            }
        ]
    },

    run: async ({ client, interaction }) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        await interaction.deferReply();

        const displayUser = interaction.member.user.globalName;
        const mentionedUserId = interaction.options.get("target-user")?.value;
        const targetUserId = mentionedUserId || interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedRank = await Rank.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id
        });

        if (!fetchedRank) {
            interaction.editReply(
                mentionedUserId ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.` : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
        }

        let allRank = await Rank.find({ guildId: interaction.guild.id }).select("-_id userId level xp");

        allRank.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allRank.findIndex((lvl) => lvl.userId === targetUserId) + 1;

        try {
            Font.loadDefault();

            const rank = new RankCardBuilder()
                .setBackground("#23272a")
                .setAvatar(targetUserObj.user.displayAvatarURL({ size: 128 }))
                .setRank(currentRank)
                .setLevel(fetchedRank.level)
                .setCurrentXP(fetchedRank.xp)
                .setRequiredXP(calculateLevelXP(fetchedRank.level))
                .setStatus(targetUserObj.presence.status)
                .setDisplayName(displayUser)
                .setUsername(targetUserObj.user.username);

            const data = await rank.build();
            const attachment = new AttachmentBuilder(data);
            interaction.editReply({ files: [attachment] });
        } catch (error) {
            interaction.editReply("This command have got issue to run. Please try again");
            console.log(error);
        }
    }
};
