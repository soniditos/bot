import { ColorResolvable, EmbedBuilder, ButtonInteraction } from "discord.js";
import { useMainPlayer } from "discord-player";
import { lyricsExtractor } from "@discord-player/extractor";
import config from "../config";

const lyricsClient = lyricsExtractor(config.geniusApiKey);

export default {
    name: "lyrics",
    async execute(interaction: ButtonInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no se reproduce música.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        await lyricsClient
            .search(`${queue.currentTrack.title} ${queue.currentTrack.author}`)
            .then((res) => {
                embed.setAuthor({
                    name: `${res.title} - ${res.artist.name}`,
                    url: res.url,
                });
                embed.setDescription(res.lyrics.length > 4000 ? `[Haga click aquí para ver la letra](${res.url})` : res.lyrics);
                embed.setFooter({ text: "Cortesía de Genius API" });
            })
            .catch(() => {
                embed.setDescription("No pude encontrar ninguna letra para esta canción...");
            });

        return await interaction.editReply({ embeds: [embed] });
    },
};
