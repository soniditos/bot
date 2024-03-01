process.env["DP_FORCE_YTDL_MOD"] = "play-dl";

import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Player } from "discord-player";
import { YouTubeExtractor, SpotifyExtractor, SoundCloudExtractor, AppleMusicExtractor, VimeoExtractor, AttachmentExtractor, ReverbnationExtractor } from "@discord-player/extractor";
import { HttpsProxyAgent } from "https-proxy-agent";
import fs from "fs";
import path from "path";
import logger from "./utils/logger";
import config from "./config";
import registerProcessEvents from "./utils/processEvents";
import handleButtons from "./functions/handleButtons";
import handleCommands from "./functions/handleCommands";
import handleEvents from "./functions/handleEvents";
import handleMenus from "./functions/handleMenus";

registerProcessEvents();

if (!fs.existsSync(path.join(__dirname, "..", "data.json"))) {
    logger.warn("No se puede encontrar el archivo data.json. Creando uno nuevo con valores predeterminados.");
    fs.writeFileSync(path.join(__dirname, "..", "data.json"), JSON.stringify({ "songs-played": 0, "queues-shuffled": 0, "songs-skipped": 0 }));
}

let proxy: string = "";
let agent: any = null;

if (config.proxy.enable) {
    proxy = config.proxy.connectionUrl;
    agent = new HttpsProxyAgent(proxy);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const player = new Player(client, { ytdlOptions: { requestOptions: { agent, headers: { cookie: config.cookies.useCustomCookie ? config.cookies.youtubeCookie : null } } } });
player.extractors.unregisterAll();
player.extractors.register(YouTubeExtractor, {});
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(SoundCloudExtractor, {});
player.extractors.register(AppleMusicExtractor, {});
player.extractors.register(VimeoExtractor, {});
player.extractors.register(ReverbnationExtractor, {});
player.extractors.register(AttachmentExtractor, {});

client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();

(async () => {
    logger.info("Inicializando Soniditos...");

    handleButtons(client);
    handleCommands(client);
    handleEvents(client);
    handleMenus(client);

    logger.info("Iniciar sesión en el cliente Discord...");
    client
        .login(config.botToken)
        .then(() => {
            if (client && client.user) logger.success(`Conectado como ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        })
        .catch((error) => {
            if (error.code === "DisallowedIntents") {
                logger.error("Habilite las intenciones correctas en su portal de desarrolladores de Discord.");
            } else {
                logger.error("Se produjo un error al intentar iniciar sesión en el cliente de Discord:");
                logger.error(String(error));
            }

            process.exit(1);
        });
})();
