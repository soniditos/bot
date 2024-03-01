import logger from "./logger";

export default function registerProcessEvents() {
    process.on("unhandledRejection", (reason: any) => {
        logger.error("Se produjo un rechazo no controlado en el proceso principal:");
        logger.error(reason.stack ? `${reason.stack}` : `${reason}`);
    });

    process.on("uncaughtException", (err) => {
        logger.error("Se produjo una excepción no detectada en el proceso principal:");
        logger.error(err.stack ? `${err.stack}` : `${err}`);
    });

    process.on("uncaughtExceptionMonitor", (err) => {
        logger.error("Se produjo un monitor de excepción no detectado en el proceso principal:");
        logger.error(err.stack ? `${err.stack}` : `${err}`);
    });

    process.on("beforeExit", (code) => {
        logger.error("El proceso está a punto de salir con código: " + code);
        process.exit(code);
    });

    process.on("exit", (code) => {
        logger.error("El proceso salió con código: " + code);
    });
}
