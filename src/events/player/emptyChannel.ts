import { ColorResolvable, EmbedBuilder } from "discord.js";
import ms from "ms";
import config from "../../config";

export default {
    name: "emptyChannel",
    async execute(queue) {
        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const embed = new EmbedBuilder();

        embed.setDescription(`La música se ha detenido por que no hay nadie escuchando.`);
        embed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [embed] });
    },
};
