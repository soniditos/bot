import { ButtonInteraction, ColorResolvable, EmbedBuilder } from "discord.js";
import { useMainPlayer } from "discord-player";
import fs from "fs";
import path from "path";
import config from "../config";

export default {
    name: "playerSkip",
    async execute(interaction: ButtonInteraction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(config.embedColour as ColorResolvable);

        if (!queue || !queue.isPlaying()) {
            embed.setDescription("Actualmente no se reproduce música.");
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.node.skip();

        const rawdata = fs.readFileSync(path.join(__dirname, "..", "..", "data.json"), "utf8");
        const data = JSON.parse(rawdata);
        data["songs-skipped"] += 1;
        fs.writeFileSync(path.join(__dirname, "..", "..", "data.json"), JSON.stringify(data));

        embed.setDescription(`<@${interaction.user.id}>: La canción **[${queue.currentTrack.title}](${queue.currentTrack.url})** se ha saltado.`);
        return await interaction.reply({ embeds: [embed] });
    },
};
