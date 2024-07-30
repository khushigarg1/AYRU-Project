"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.generateRandomNumber = void 0;
class CustomError extends Error {
    constructor({ name, message }) {
        super(message);
        this.name = name;
        this.error = { message };
        this.stack = new Error().stack;
    }
}
exports.CustomError = CustomError;
function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
exports.generateRandomNumber = generateRandomNumber;
