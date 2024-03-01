import { ButtonInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../config";

export default {
    name: "playerBack",
    async execute(interaction: ButtonInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no se reproduce música.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("No se reprodujo música antes de esta canción.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await queue.history.back();
        embed.setDescription(`<@${interaction.user.id}>: Volviendo a la canción anterior en la cola de reproducción.`);

        return await interaction.reply({ embeds: [embed] });
    },
};
