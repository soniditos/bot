import logger from "../../utils/logger";
import config from "../../config";
import { initConsole } from "../../utils/console";
import axios from "axios";
import crypto from "crypto";
import { Client, Events } from "discord.js";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        if (config.enableAnalytics) {
            axios.post("https://analytics.techy.lol/melody", { identifier: crypto.createHash("sha256").update(config.clientId).digest("hex") }, { headers: { "Content-Type": "application/json" } }).catch(() => null);
        }

        initConsole(client);

        logger.success("Soniditos ya está listo.");

        if (client.guilds.cache.size === 0) {
            logger.warn(`Invita a Soniditos a tu servidor usando el siguiente enlace: https://soniditos.com/bot`);
        } else {
            logger.info(`Soniditos is in ${client.guilds.cache.size} ${client.guilds.cache.size === 1 ? "server" : "servers"}.`);
        }
    },
};
