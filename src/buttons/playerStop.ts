import { ButtonInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../config";

export default {
    name: "playerStop",
    async execute(interaction: ButtonInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no se reproduce música.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.delete();

        embed.setDescription(`<@${interaction.user.id}>: La música se ha detenido.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
