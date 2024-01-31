import {ApiClient} from "../RestServices/BaseRestServices";

/**
 * @param {object} queryParams -  Query parameter in Json format
 */

export const getStates = (queryParams) => {
    return ApiClient.get("/event/states", {params: queryParams ?? {}});
};

/**
 * @param {object} queryParams - Query parameter in Json format
 */

export const getDataLevels = (queryParams) => {
    return ApiClient.get("/event/data_levels", {params: queryParams});
};
