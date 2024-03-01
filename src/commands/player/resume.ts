import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("resume").setDescription("Reanuda la canción actual.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.node.isPaused()) {
            embed.setDescription("La cola de reproducción no está actualmente en pausa.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.node.setPaused(false);

        embed.setDescription(`Se ha reanudado **[${queue.currentTrack.title}](${queue.currentTrack.url})**.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
