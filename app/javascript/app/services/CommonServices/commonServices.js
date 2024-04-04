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

/**
 * returns all languages
 */

export const getAllLanguages=()=>{
    return ApiClient.get('/event/languages');
}

/**
 *
 * @param body - contains is_hidden - boolean and  event_id as json
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const hideUnhideEvents=(body)=>{
    return ApiClient.post('/event/hide_event',body)
}


/**
 * @param  - contains event_id and search_query
 */

export  const getEventCsvData=(queryParams)=>{
    return ApiClient.get('event/event_user_location',{params:queryParams});
}

/**
 *
 */
export const postEventCsvData=(body)=>{
    return ApiClient.post('event/event_user_location',body)
}


/**
 * returns all recent uploaded csv files
 */
export const getLatestCsvUploads=(queryParams)=>{
    return ApiClient.get('event/latest_uploads',{params:queryParams});
}