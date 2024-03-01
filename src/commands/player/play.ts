import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer, QueryType } from "discord-player";
import ms from "ms";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Agrega una canción al final de La cola de reproducción de reproducción.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("query").setDescription("Ingresa el nombre de una canción, un nombre de artista o una URL.").setRequired(true).setAutocomplete(config.enableAutocomplete)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            embed.setDescription("Actualmente no estás en un canal de voz.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("No puedo reproducir música en ese canal de voz.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("query");

        const player = useMainPlayer();
        let queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            player.nodes.create(interaction.guild.id, {
                leaveOnEmpty: true,
                leaveOnEnd: true,
                leaveOnStop: true,
                leaveOnEmptyCooldown: Math.round(ms(config.player.leaveOnEmptyDelay) / 1000),
                leaveOnEndCooldown: Math.round(ms(config.player.leaveOnEndDelay) / 1000),
                leaveOnStopCooldown: Math.round(ms(config.player.leaveOnStopDelay) / 1000),
                selfDeaf: config.player.deafenBot,
                metadata: {
                    channel: interaction.channel,
                    client: interaction.guild.members.me,
                    requestedBy: interaction.user,
                },
            });

            queue = player.nodes.get(interaction.guild.id);
        }

        try {
            const res = await player.search(query, { requestedBy: interaction.user });

            if (!res || !res.tracks || res.tracks.length === 0) {
                if (queue) queue.delete();
                embed.setDescription(`No pude encontrar nada con el nombre **${query}**.`);
                return await interaction.editReply({ embeds: [embed] });
            }

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch (err) {
                if (queue) queue.delete();
                embed.setDescription("No puedo unirme a ese canal de voz. Puede que esté lleno o que no tenga los permisos correctos.");
                return await interaction.editReply({ embeds: [embed] });
            }

            try {
                res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
                if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
            } catch (err) {
                logger.error("Se produjo un error al intentar reproducir este medio.:");
                logger.error(err);

                await queue.delete();

                embed.setDescription("Parece que este medio no funciona en este momento. Vuelve a intentarlo más tarde.");
                return await interaction.followUp({ embeds: [embed] });
            }

            if (!res.playlist) {
                embed.setDescription(`Añadidas **[${res.tracks[0].title}](${res.tracks[0].url})** canciones por **${res.tracks[0].author}** a la cola del reproducción.`);
            } else {
                embed.setDescription(`**${res.tracks.length} canciones** de ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** se han añadido a la cola del reproducción.`);
            }
        } catch (err) {
            logger.error(err);
            return interaction.editReply({ content: "Se produjo un error al intentar reproducir este medio." });
        }

        return await interaction.editReply({ embeds: [embed] });
    },
    async autocompleteRun(interaction) {
        const player = useMainPlayer();
        const query = interaction.options.getString("query", true);
        const resultsYouTube = await player.search(query, { searchEngine: QueryType.YOUTUBE });
        const resultsSpotify = await player.search(query, { searchEngine: QueryType.SPOTIFY_SEARCH });

        const tracksYouTube = resultsYouTube.tracks.slice(0, 5).map((t) => ({
            name: `YouTube: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
            value: t.url,
        }));

        const tracksSpotify = resultsSpotify.tracks.slice(0, 5).map((t) => ({
            name: `Spotify: ${`${t.title} - ${t.author} (${t.duration})`.length > 75 ? `${`${t.title} - ${t.author}`.substring(0, 75)}... (${t.duration})` : `${t.title} - ${t.author} (${t.duration})`}`,
            value: t.url,
        }));

        const tracks = [];

        tracksYouTube.forEach((t) => tracks.push({ name: t.name, value: t.value }));
        tracksSpotify.forEach((t) => tracks.push({ name: t.name, value: t.value }));

        return interaction.respond(tracks);
    },
};
