import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Ajusta el volumen de la música actual.")
        .setDMPermission(false)
        .addIntegerOption((option) => option.setName("volume").setDescription("El volumen al que poner la música.").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no se reproduce música.");
        } else {
            const vol = interaction.options.getInteger("volume");

            if (queue.node.volume === vol) {
                embed.setDescription(`El volumen de cola actual ya está configurado en ${vol}%.`);
                return await interaction.reply({ embeds: [embed] });
            }

            if (vol < 0 || vol > 1000) {
                embed.setDescription("El número que has especificado no es válido. Introduzca un número entre **0** y **1000**.");
                return await interaction.reply({ embeds: [embed] });
            }

            const success = queue.node.setVolume(vol);
            success ? embed.setDescription(`El volumen de la cola se ha configurado en **${vol}%**.`): embed.setDescription("Se produjo un error al intentar configurar el volumen.");
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
