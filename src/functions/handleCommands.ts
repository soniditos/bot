const { REST, Routes } = require("discord.js");
import fs from "fs";
import path from "path";
import logger from "../utils/logger";
import config from "../config";
import { Client } from "discord.js";

const token = config.botToken;
const clientId = config.clientId;

export default (client: Client) => {
    if (!fs.existsSync(path.join(__dirname, "..", "commands"))) return;

    client.commandArray = [];

    fs.readdirSync(path.join(__dirname, "..", "commands")).forEach((folder) => {
        fs.readdirSync(path.join(__dirname, "..", "commands", folder))
            .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
            .forEach((file) => {
                const command = require(`../commands/${folder}/${file}`).default;
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            });
    });

    const rest = new REST().setToken(token);

    (async () => {
        try {
            logger.info("Recargando comandos de la aplicación...");
            await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray });
            logger.success("Comandos de la aplicación recargados exitosamente.");
        } catch (error) {
            logger.error("Se produjo un error al intentar recargar los comandos de la aplicación:");
            logger.error(String(error));
        }
    })();
};
