import { instance } from "../utilities/helpers";


export const getDashboardCountersAPI = (config) => {
    return instance
    .get("/dashboard-counters/", config);
}
export const getCompletedCampaignsAPI= (config, offset, limit) => {
    let searchQ = '';
    searchQ=`/completed-campaigns/?limit=${limit}&offset=${offset}`
 
    return instance
     .get(searchQ,config)
}



