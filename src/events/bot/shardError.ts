import { Events } from "discord.js";
import logger from "../../utils/logger";

export default {
    name: Events.ShardError,
    once: false,
    async execute(error) {
        logger.error("Se produjo un error no controlado durante el tiempo de ejecución:");
        logger.error(error);
    },
};
