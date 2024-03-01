import { ColorResolvable, EmbedBuilder } from "discord.js";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    name: "error",
    async execute(queue, error) {
        logger.error("Se produjo un error de bot no controlado durante el tiempo de ejecución:");
        logger.error(error);

        try {
            queue.delete();
        } catch (err) {
            null;
        }

        const errEmbed = new EmbedBuilder();
        errEmbed.setDescription("Se produjo un error al intentar realizar esta acción. Es posible que este medio no sea compatible.");
        errEmbed.setColor(config.embedColour as ColorResolvable);

        queue.metadata.channel.send({ embeds: [errEmbed] });
        return;
    },
};
