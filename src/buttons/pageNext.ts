import { ButtonBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonInteraction, ColorResolvable } from "discord.js";
import { useMainPlayer } from "discord-player";
import { paginate, numberOfPages } from "../utils/pagination";
import config from "../config";

export default {
    name: "pageNext",
    async execute(interaction: ButtonInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const currentPage = parseInt(String(interaction.customId).split("-")[2]);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue) {
            embed.setDescription("La cola de reproducción para este servidor parece que ya no existe.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const queuedTracks = queue.tracks.toArray();

        embed.setThumbnail(interaction.guild.iconURL({ size: 2048 }) || interaction.client.user.displayAvatarURL({ size: 2048 }));
        embed.setAuthor({ name: `Cola de reproducción - ${interaction.guild.name}` });

        const numPages = numberOfPages(queuedTracks, 5);

        if (currentPage + 1 > numPages) return interaction.update({ content: null });

        const paginated = paginate(queuedTracks, 5, (currentPage + 1) % numPages);

        const tracks = paginated.data.map((track, i) => `\`${paginated.startIndex + i + 1}\` [${track.title}](${track.url}) de **${track.author}** (Añadido por <@${track.requestedBy.id}>)`);
        const progress = queue.node.createProgressBar();

        embed.setDescription(`**Está sonando:** [${queue.currentTrack.title}](${queue.currentTrack.url}) de **${queue.currentTrack.author}**\n${progress}\n\n${tracks.join("\n")}`);
        embed.setFooter({ text: `${queuedTracks.length} canciones  •  Página ${currentPage + 1} de ${numPages}` });
        embed.setTimestamp();

        const row1 = new ActionRowBuilder<any>().addComponents(
            new ButtonBuilder()
                .setCustomId(`pageFirst-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Primera página")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`pagePrevious-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Página anterior")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`pageNext-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Página siguiente")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`pageLast-${interaction.user.id}-${currentPage + 1}`)
                .setLabel("Última página")
                .setStyle(ButtonStyle.Primary)
        );

        const row2 = new ActionRowBuilder<any>().addComponents(
            new ButtonBuilder()
                .setCustomId("playerBack")
                .setEmoji(config.emojis.back.length <= 3 ? { name: config.emojis.back.trim() } : { id: config.emojis.back.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("playerPause")
                .setEmoji(config.emojis.pause.length <= 3 ? { name: config.emojis.pause.trim() } : { id: config.emojis.pause.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("playerSkip")
                .setEmoji(config.emojis.pause.length <= 3 ? { name: config.emojis.skip.trim() } : { id: config.emojis.skip.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("playerStop")
                .setEmoji(config.emojis.stop.length <= 3 ? { name: config.emojis.stop.trim() } : { id: config.emojis.stop.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId("lyrics")
                .setEmoji(config.emojis.lyrics.length <= 3 ? { name: config.emojis.lyrics.trim() } : { id: config.emojis.lyrics.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.update({ embeds: [embed], components: numPages > 1 ? [row1, row2] : [row2] });
    },
};
