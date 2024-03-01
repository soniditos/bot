import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../config";

export default {
    name: "disconnect",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const embed = new EmbedBuilder();

        embed.setDescription("La música se ha detenido por que he salido del canal.");
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
