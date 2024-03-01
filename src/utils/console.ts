import readline from "readline";
import { Client } from "discord.js";
import config from "../config";
import chalk from "chalk";
import os from "os-utils";
import fs from "fs";
import path from "path";

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8"));

const Console = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const banner = `🎵`;

function print(str: string) {
    console.info(chalk.magenta(str));
}

function getCpuUsage(): Promise<string> {
    return new Promise((resolve) => {
        os.cpuUsage((value) => resolve((value * 100).toFixed(2)));
    });
}

async function getUsageStats() {
    const stats = { cpu: null, memTotal: null, memFree: null, platform: null, uptime: null };
    stats.cpu = await getCpuUsage();
    stats.memFree = `${os.freemem().toFixed(2)} MB`;
    stats.memTotal = `${os.totalmem().toFixed(2)} MB`;
    stats.platform = os.platform();
    stats.uptime = os.processUptime().toFixed(2);
    return stats;
}

export function initConsole(client: Client): void {
    Console.question("", async (input) => {
        switch (input.toLowerCase()) {
            case "help":
                print(`help: Muestra este menú
info: Muestra información sobre esta instancia del bot
invite: Muestra un enlace de invitación para este bot de Soniditos en Discord
servers: Muestra el número de servidores en los que actualmente está esta instancia de Soniditos
stop: Detiene la instancia del bot`);
                return initConsole(client);
            case "info": {
                const usageStats = await getUsageStats();
                print(`-----------------------------------------------------------------------------------
${banner}

Soniditos ${packageJson.version}.

Using ${Object.keys(packageJson.dependencies).length + Object.keys(packageJson.devDependencies).length} packages

Uso de la CPU: ${usageStats.cpu}%
Total de memoria: ${usageStats.memTotal}
Memoria libre: ${usageStats.memFree}
Plataforma: ${usageStats.platform}
Encendido desde hace: ${usageStats.uptime} segundos
-----------------------------------------------------------------------------------`);
                return initConsole(client);
            }
            case "invite":
                print(`Utiliza este enlace para invitar su instancia de Soniditos a un servidor:\nhttps://soniditos.com/bot`);
                return initConsole(client);
            case "servers":
                print(`La instancia de Soniditos está en ${client.guilds.cache.size} servidores.`);
                return initConsole(client);
            case "stop":
                return process.exit(0);
            default:
                console.error("Comando no válido: el comando que ha ingresado no es válido. Utilice 'help' para ver una lista de comandos.");
                return initConsole(client);
        }
    });
}
