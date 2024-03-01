import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import ms from "ms";
import fs from "fs";
import path from "path";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("playshuffle")
        .setDescription("Reproduce la lista de reproducción especificada con un orden de cancións aleatorio.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("playlist").setDescription("Enter a playlist URL here to playshuffle.").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        const channel = interaction.member.voice.channel;

        if (!channel) {
            embed.setDescription("You aren't currently in a voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            embed.setDescription("I can't play music in that voice channel.");
            return await interaction.editReply({ embeds: [embed] });
        }

        const query = interaction.options.getString("playlist");

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
                embed.setDescription(`No pude encontrar una lista de reproducción con el nombre: **${query}**`);
                return await interaction.editReply({ embeds: [embed] });
            }

            if (!res.playlist) {
                embed.setDescription("La consulta especificada no parece ser una lista de reproducción.");
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
                queue.addTrack(res.tracks);
                await queue.tracks.shuffle();
                if (!queue.isPlaying()) await queue.node.play(queue.tracks[0]);
            } catch (err) {
                logger.error("Se produjo un error al intentar reproducir este medio:");
                logger.error(err);

                await queue.delete();

                embed.setDescription("Este medio no parece funcionar en este momento. Vuelve a intentarlo más tarde.");
                return await interaction.followUp({ embeds: [embed] });
            }

            embed.setDescription(`**${res.tracks.length} tracks** from the ${res.playlist.type} **[${res.playlist.title}](${res.playlist.url})** se han cargado en de reproducción del servidor.`);
        } catch (err) {
            logger.error(err);
            return interaction.editReply({ content: "Se produjo un error al intentar reproducir este medio." });
        }

        const data = fs.readFileSync(path.join(__dirname, "..", "..", "..", "data.json"), "utf8");
        const parsed = JSON.parse(data);
        parsed["queues-shuffled"] += 1;
        fs.writeFileSync(path.join(__dirname, "..", "..", "..", "data.json"), JSON.stringify(parsed));

        return await interaction.editReply({ embeds: [embed] });
    },
};
