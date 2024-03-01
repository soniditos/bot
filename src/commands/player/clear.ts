import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("clear").setDescription("Elimina todas las cancións de la cola.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
        } else if (!queue.tracks.toArray()[0]) {
            embed.setDescription("No hay otras canciones en la cola. Utiliza **/stop** para detener la canción actual.");
        } else {
            queue.tracks.clear();
            embed.setDescription("La cola de reproducción de reproducción se ha borrado.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
