import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import config from "../../config";
import fs from "fs";
import path from "path";

export default {
    data: new SlashCommandBuilder().setName("shuffle").setDescription("Mezcla aleatoriamente todas las cancións actualmente en la cola.").setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no hay música reproduciéndose");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.tracks.toArray()[0]) {
            embed.setDescription("There aren't any other tracks in the queue. Use **/play** to add some more.");
            return await interaction.reply({ embeds: [embed] });
        }

        queue.tracks.shuffle();

        const rawdata = fs.readFileSync(path.join(__dirname, "..", "..", "..", "data.json"), "utf8");
        const data = JSON.parse(rawdata);
        data["queues-shuffled"] += 1;
        fs.writeFileSync(path.join(__dirname, "..", "..", "..", "data.json"), JSON.stringify(data));

        embed.setDescription(`¡Se han mezclado con éxito **${queue.tracks.toArray().length} pista${queue.tracks.size === 1 ? "" : "s"}**!`);
        return await interaction.reply({ embeds: [embed] });
    },
};
