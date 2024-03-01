import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("nightcore").setDescription("Aplica el efecto nocturno").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
        } else {
            queue.filters.ffmpeg.toggle(["nightcore"]);
            embed.setDescription(`**nightcore** ${queue.filters.ffmpeg.filters.includes("nightcore") ? "activado." : "desactivado."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
