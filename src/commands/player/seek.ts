import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Busca la canción actual hasta la posición especificada.")
        .setDMPermission(false)
        .addIntegerOption((option) => option.setName("minutes").setDescription("The amount of minutes to seek to.").setRequired(true))
        .addIntegerOption((option) => option.setName("seconds").setDescription("The amount of seconds to seek to.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
            return await interaction.reply({ embeds: [embed] });
        }

        const minutes = interaction.options.getInteger("minutes");
        const seconds = interaction.options.getInteger("seconds");

        const newPosition = minutes * 60 * 1000 + seconds * 1000;

        if (newPosition > queue.node.getTimestamp().total.value) {
            embed.setDescription(`La canción actual es sólo **${queue.node.getTimestamp().total.label}** de largo.`);
            return await interaction.reply({ embeds: [embed] });
        }

        await queue.node.seek(newPosition);

        embed.setDescription(`Se ha buscado la posición actual **${queue.node.getTimestamp().current.label}**.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
