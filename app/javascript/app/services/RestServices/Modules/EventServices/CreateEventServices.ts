import { ApiClient } from "../../BaseRestServices";

// /**
//  * Adds two numbers together.
//  *
//  * @param {number} num1 - The first number.
//  * @param {number} num2 - The second number.
//  * @returns {number} The sum of num1 and num2.
//  */
// export const addNumbers = (num1, num2) => {
//   return num1 + num2;
// };

/**
 * creates event
 *
 * @param {any} body - payload in any format
 * @param {object} params - Query params in Json format
 */

export const createEvent = (body: any, params: object) => {
  return ApiClient.post("/event/create", body, { params: params });
};
