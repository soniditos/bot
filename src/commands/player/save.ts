import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("save").setDescription("Envía un mensaje directo con la canción actual.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no se reproduce música.");
            return await interaction.reply({ embeds: [embed] });
        }

        let message = `
            **Canción:** [${queue.currentTrack.title}](${queue.currentTrack.url})
            **Artista:** ${queue.currentTrack.author}
            **Duración:** ${queue.currentTrack.duration}\n`;

        if (queue.currentTrack.playlist) message += `**Lista de reproducción:** [${queue.currentTrack.playlist.title}](${queue.currentTrack.playlist.url})\n`;
        message += `**Guardado:** <t:${Math.round(Date.now() / 1000)}:R>`;

        const info = new EmbedBuilder();
        info.setColor(config.embedColour as ColorResolvable);
        info.setTitle("Se ha guardado");
        info.setDescription(message);
        info.setThumbnail(queue.currentTrack.thumbnail);
        info.setFooter({ text: `Canción escuchada en: ${interaction.guild.name}` });
        info.setTimestamp();

        try {
            await interaction.user.send({ embeds: [info] });
        } catch (err) {
            embed.setDescription("No puedo enviarte mensajes directos. Verifique su configuración de privacidad e inténtelo nuevamente.");
            return await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }

        embed.setDescription("¡Guardaste exitosamente la canción actual en tus mensajes directos!");
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
