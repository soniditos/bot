import { ColorResolvable, EmbedBuilder } from "discord.js";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    name: "playerError",
    async execute(queue, error) {
        logger.error("Se produjo un error del jugador al intentar realizar esta acción:");
        logger.error(error);

        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("Se produjo un error del jugador al intentar realizar esta acción.");
        errEmbed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
