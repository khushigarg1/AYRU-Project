"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gracefullyShutdown = exports.unexpectedErrorHandler = void 0;
/**
 * Handler for exit
 */
const exitHandler = (app, exitCode) => {
    app.close(() => {
        app.log.info("Server closed");
        process.exit(exitCode);
    });
};
/**
 * Error Handling
 */
const unexpectedErrorHandler = (app, error) => {
    app.log.error(error);
    exitHandler(app, 1);
};
exports.unexpectedErrorHandler = unexpectedErrorHandler;
/**
 * Application shutdown
 */
const gracefullyShutdown = (app) => {
    app.log.info("Attempting to gracefully shutdown the app...");
    exitHandler(app, 0);
};
exports.gracefullyShutdown = gracefullyShutdown;
