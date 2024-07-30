"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: "white",
        debug: "green",
        info: "green",
        warn: "yellow",
        error: "red",
        fatal: "red",
    },
};
const formatter = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.splat(), winston_1.default.format.printf((info) => {
    const { timestamp, level, message } = info, meta = __rest(info, ["timestamp", "level", "message"]);
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
}));
class Logger {
    constructor() {
        const prodTransport = new winston_1.default.transports.File({
            filename: "logs/error.log",
            level: "error",
        });
        const devTransport = new winston_1.default.transports.Console({
            format: formatter,
            level: "debug",
        });
        this.logger = winston_1.default.createLogger({
            level: process.env.NODE_ENV === "development" ? "trace" : "error",
            levels: customLevels.levels,
            transports: [
                process.env.NODE_ENV === "development" ? devTransport : prodTransport,
            ],
        });
        winston_1.default.addColors(customLevels.colors);
    }
    trace(msg, meta) {
        this.logger.log("trace", msg, meta);
    }
    debug(msg, meta) {
        this.logger.debug(msg, meta);
    }
    info(msg, meta) {
        this.logger.info(msg, meta);
    }
    warn(msg, meta) {
        this.logger.warn(msg, meta);
    }
    error(msg, meta) {
        this.logger.error(msg, meta);
    }
    fatal(msg, meta) {
        this.logger.log("fatal", msg, meta);
    }
}
exports.logger = new Logger();
