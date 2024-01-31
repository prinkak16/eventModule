import {ApiClient} from "../../BaseRestServices";

/**
 * creates event
 *
 * @param {any} body - payload in any format
 * @param {object} params - Query params in Json format
 */

export const createEvent = (body: any, params: object) => {
    return ApiClient.post("/event/create", body, {params: params});
};
