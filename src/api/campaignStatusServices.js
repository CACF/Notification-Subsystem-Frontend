
import { instance } from "../utilities/helpers";

export const getCampaignStatusAPI = (config) => {
    return instance
    .get("/workers-detail/", config);
}