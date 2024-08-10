// export const omitCostPrice = (data: any): any => {
//   if (Array.isArray(data)) {
//     return data.map(omitCostPrice);
//   }

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

export const omitCostPrice = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(omitCostPrice);
  }

  if (data && typeof data === "object" && !(data instanceof Date)) {
    const result: any = {};

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === "costPrice") {
          continue;
        }

        const value = data[key];

        if (
          typeof value === "object" &&
          value !== null &&
          !(value instanceof Date)
        ) {
          result[key] = omitCostPrice(value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  }

  return data;
};
