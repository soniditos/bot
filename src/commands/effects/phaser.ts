import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("phaser").setDescription("Aplica el efecto de fase").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
        } else {
            queue.filters.ffmpeg.toggle(["phaser"]);
            embed.setDescription(`**phaser** ${queue.filters.ffmpeg.filters.includes("phaser") ? "activado." : "desactivado."}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
