import { instance } from "../utilities/helpers";

//For Post Single SMS
export const postSingleSMS = (config, params) => {
  return instance.post(`/sms/`, params, config);
};

//For Post Bulk SMS
export const postCampaignSMS = (config, params) => {
  return instance.post(`/sms-campaign/`, params, config);
};

//For Post Single Email
export const postSingleEmail = (config, params) => {
  return instance.post(`/email/`, params, config);
};

//For Post Bulk Email
export const postCampaignEmail = (config, params) => {
  return instance.post(`/email-campaign/`, params, config);
};
