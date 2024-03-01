import chalk from "chalk";
import fs from "fs";
import { format } from "date-fns";

class Logger {
    info(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [soniditos] [INFO]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.info(chalk.cyan(`[soniditos] ${chalk.bold("INFO:")} ${str}`));
    }

    warn(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [soniditos] [WARN]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.warn(chalk.yellow(`[soniditos] ${chalk.bold("WARNING:")} ${str}`));
    }

    error(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [soniditos] [ERROR]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.error(chalk.red(`[soniditos] ${chalk.bold("ERROR:")} ${str}`));
    }

    success(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Log-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [soniditos] [SUCCESS]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.info(chalk.green(`[soniditos] ${chalk.bold("SUCCESS:")} ${str}`));
    }

    debug(str: string) {
        if (!fs.existsSync("logs")) {
            fs.mkdirSync("logs");
        }
        fs.appendFile(`logs/Debug-${format(new Date(), "yyyy-MM-dd")}.log`, `[${format(new Date(), "hh:mm:ss")}] [soniditos] [DEBUG]: ${str}\n`, (err) => {
            if (err) throw err;
        });
        console.info(chalk.blueBright(`[soniditos] ${chalk.bold("DEBUG:")} ${str}`));
    }
}

const logger = new Logger();
export default logger;
