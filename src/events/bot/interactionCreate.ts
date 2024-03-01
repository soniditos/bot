import { ColorResolvable, EmbedBuilder, Events, Interaction } from "discord.js";
import logger from "../../utils/logger";
import config from "../../config";

export default {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                logger.error("Se produjo un error al intentar ejecutar un comando de entrada de chat:");
                logger.error(error);
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.includes("-")) {
                const sections = String(interaction.customId).split("-");

                if (interaction.user.id != sections[1]) {
                    const embed = new EmbedBuilder();
                    embed.setColor(config.embedColour as ColorResolvable);
                    embed.setDescription(`Solamente <@${sections[1]}> puede usar este botón.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const button = client.buttons.get(sections[0]);
                if (!button) return;

                try {
                    await button.execute(interaction, client);
                } catch (error) {
                    logger.error("Se produjo un error al intentar ejecutar un comando de botón:");
                    logger.error(error);
                }
            } else {
                const button = client.buttons.get(interaction.customId);
                if (!button) return;

                try {
                    await button.execute(interaction, client);
                } catch (error) {
                    logger.error("Se produjo un error al intentar ejecutar un comando de botón:");
                    logger.error(error);
                }
            }
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId.includes("-")) {
                const sections = String(interaction.customId).split("-");

                if (interaction.user.id != sections[1]) {
                    const embed = new EmbedBuilder();
                    embed.setColor(config.embedColour as ColorResolvable);
                    embed.setDescription(`Solamente <@${sections[1]}> puede usar este menú.`);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const menu = client.menus.get(sections[0]);
                if (!menu) return;

                try {
                    await menu.execute(interaction, client);
                } catch (error) {
                    logger.error("Se produjo un error al intentar ejecutar un comando de menú:");
                    logger.error(error);
                }
            } else {
                const menu = client.menus.get(interaction.customId);
                if (!menu) return;

                try {
                    await menu.execute(interaction, client);
                } catch (error) {
                    logger.error("Se produjo un error al intentar ejecutar un comando de menú:");
                    logger.error(error);
                }
            }
        } else if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocompleteRun(interaction, client);
            } catch (error) {
                logger.error("Se produjo un error al intentar ejecutar la función de autocompletar:");
                logger.error(error);
            }
        }
    },
};
