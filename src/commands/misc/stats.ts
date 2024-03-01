import { ChatInputCommandInteraction, ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../../config";
import fs from "fs";
import path from "path";

export default {
    data: new SlashCommandBuilder().setName("stats").setDescription("Muestra las estadísticas globales del bot."),
    async execute(interaction: ChatInputCommandInteraction) {
        const rawdata = fs.readFileSync(path.join(__dirname, "..", "..", "..", "data.json"), "utf8");
        const data = JSON.parse(rawdata);

        const embed = new EmbedBuilder();
        embed.setDescription(`Soniditos está actualmente en **${interaction.client.guilds.cache.size} servidores**, ha reproducido **${data["songs-played"]} canciones**, saltado **${data["songs-skipped"]} canciones**, y mezclado **${data["queues-shuffled"]} colas de reproducción**.`);
        embed.setColor(config.embedColour as ColorResolvable);

        return await interaction.reply({ embeds: [embed] });
    },
};
