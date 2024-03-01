import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("back").setDescription("Vuelve a la canción anterior.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
        } else if (!queue.history.tracks.toArray()[0]) {
            embed.setDescription("No se reproducía nada antes de esta canción.");
        } else {
            await queue.history.back();
            embed.setDescription("Volviendo a la canción anterior en la cola de reproducción. ");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
