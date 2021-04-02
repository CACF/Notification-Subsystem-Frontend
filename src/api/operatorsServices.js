import { instance } from "../utilities/helpers";

export const getOperatorsAPI = (config) => {
    return instance
    .get("/mno-names/", config);
}