import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer, QueueRepeatMode } from "discord-player";
import config from "../../config";

export default {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Permite cambiar el modo de bucle actual o habilitar la reproducción automática.")
        .setDMPermission(false)
        .addStringOption((option) => option.setName("mode").setDescription("Loop mode").setRequired(true).addChoices({ name: "off", value: "off" }, { name: "queue", value: "queue" }, { name: "track", value: "track" }, { name: "autoplay", value: "autoplay" })),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música para reproducir.");
        } else {
            switch (String(interaction.options.getString("mode")).toLowerCase()) {
                case "off":
                    queue.setRepeatMode(QueueRepeatMode.OFF);
                    embed.setDescription("El bucle está **desactivado**.");
                    break;
                case "queue":
                    queue.setRepeatMode(QueueRepeatMode.QUEUE);
                    embed.setDescription("**La cola de reproducción de reproducción** ahora se repetirá sin cesar.");
                    break;
                case "track":
                    queue.setRepeatMode(QueueRepeatMode.TRACK);
                    embed.setDescription("**La canción** ahora se repetirá sin cesar.");
                    break;
                case "autoplay":
                    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                    embed.setDescription("La cola de reproducción ahora se reproducirá **automáticamente**.");
                    break;
            }
        }

        return await interaction.reply({ embeds: [embed] });
    },
};
