import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { lyricsExtractor } from "@discord-player/extractor";
import config from "../../config";

const lyricsClient = lyricsExtractor(config.geniusApiKey);

export default {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Ver la letra de una canción.")
        .addStringOption((option) => option.setName("query").setDescription("Ingresa el nombre de una canción, un nombre de artista o una URL.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        await lyricsClient
            .search(interaction.options.getString("query"))
            .then((res) => {
                embed.setAuthor({
                    name: `${res.title} - ${res.artist.name}`,
                    url: res.url,
                });
                embed.setDescription(res.lyrics.length > 4096 ? `[Haga click aquí para ver la letra](${res.url})` : res.lyrics);
                embed.setFooter({ text: "Cortesía de Genius API" });
            })
            .catch(() => {
                embed.setDescription(`No pude encontrar la letra de la canción **${interaction.options.getString("query")}**.`);
            });

        return await interaction.editReply({
            embeds: [embed],
        });
    },
};
