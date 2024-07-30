"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config = {
    confKey: "config",
    schema: {
        type: "object",
        required: ["DATABASE_URL"],
        properties: {
            BIND_PORT: {
                type: "number",
                default: 5000,
            },
            BIND_ADDR: {
                type: "string",
                default: "127.0.0.1",
            },
            APP_SERVER_NAME: {
                type: "string",
                default: "localhost",
            },
            PROJECT_NAME: {
                type: "string",
                default: "AyruProject",
            },
            DATABASE_URL: {
                type: "string",
            },
            ENABLE_SWAGGER: {
                type: "boolean",
                default: true,
            },
        },
    },
};
exports.default = Config;
