"use strict";
// export const omitCostPrice = (data: any): any => {
//   if (Array.isArray(data)) {
//     return data.map(omitCostPrice);
//   }
Object.defineProperty(exports, "__esModule", { value: true });
exports.omitCostPrice = void 0;
//   if (data && typeof data === "object") {
//     const { costPrice, ...rest } = data;
//     for (const key in rest) {
//       if (rest.hasOwnProperty(key)) {
//         rest[key] = omitCostPrice(rest[key]);
//       }
//     }
//     return rest;
//   }
//   return data;
// };
const omitCostPrice = (data) => {
    if (Array.isArray(data)) {
        return data.map(exports.omitCostPrice);
    }
    if (data && typeof data === "object" && !(data instanceof Date)) {
        const result = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (key === "costPrice") {
                    continue;
                }
                const value = data[key];
                if (typeof value === "object" &&
                    value !== null &&
                    !(value instanceof Date)) {
                    result[key] = (0, exports.omitCostPrice)(value);
                }
                else {
                    result[key] = value;
                }
            }
        }
        return result;
    }
    return data;
};
exports.omitCostPrice = omitCostPrice;
