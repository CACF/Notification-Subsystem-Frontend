import  * as CampaignCreateAction   from "../api/createNotificationService";
import { SweetAlert,errors } from '../utilities/helpers'

//Single SMS Action



export const singleSMSAction = (config, params) => {
 CampaignCreateAction.postSingleSMS(config, "");
 
};


//Bulk SMS Action
export const campaignSMSAction = (config, params) => {
  CampaignCreateAction.postCampaignSMS(config, "");
 
};
//Single Email Action
export const singleEmailAction = (config, params) => {
  console.log(params);
  const response = CampaignCreateAction.postSingleEmail(config, params);
  response
    .then((res) => {
      if (res.status === 200) {
        params = {
          icon: 'success',
          title: "Success",
          message: res.data.message,
          type: "Success",
        };
        SweetAlert(params);
      }
    })
    .catch((err) =>  errors(this, err));
};

//Bulk Email Action
export const campaignEmailAction = (config, params) => {
  const response = CampaignCreateAction.postCampaignEmail(config, params);
  response
    .then((res) => {
      if (res.status === 200) {
        params = {
          icon: 'success',
          title: "Success",
          message: res.data.message,
          type: "Success",
        };
        SweetAlert(params);
      }
    })
    .catch((err) =>  errors(this, err));
};
