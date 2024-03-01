import { EmbedBuilder, ButtonStyle, SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ColorResolvable, ChatInputCommandInteraction } from "discord.js";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("botinfo").setDescription("Muestra información del bot."),
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder();
        embed.setDescription("Bot de música de Discord");
        embed.setColor(config.embedColour as ColorResolvable);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("GitHub").setURL("https://github.com/soniditos/bot"),
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
