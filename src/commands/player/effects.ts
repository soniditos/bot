import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder().setName("effects").setDescription("Enumera todos los efectos que están actualmente habilitados.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (queue.filters.ffmpeg.filters.length === 0) {
            embed.setDescription("Actualmente no hay ningún efecto habilitado.");
        } else {
            embed.setDescription(`**Los siguientes efectos están actualmente habilitados:** ${queue.filters.ffmpeg.filters.join(", ").replace("surrounding", "surround")}`);
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
