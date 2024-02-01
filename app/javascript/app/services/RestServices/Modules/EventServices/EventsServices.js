/**
 * @param
 */

import {ApiClient} from "../../BaseRestServices";

export const getEventById = (id) => {
    return ApiClient.get(`/event/edit/${id}`);
};
