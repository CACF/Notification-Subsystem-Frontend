import * as campaignStatus from "../api/campaignStatusServices";
import { GET_CAMPAIGN_STATUS } from "./types";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const campaignStatusAction = (data) => {
  return {
    type: GET_CAMPAIGN_STATUS,
    payload: data,
  };
};
export const getCampaignStatus = (config) => (dispatch) => {
  const response = campaignStatus.getCampaignStatusAPI(config);
  response
    .then((res) => {
      if (res.status === 200) {
        dispatch(campaignStatusAction(res.data));
      }
    })
    .catch((err) => {
      try {
        return <> {err.response.status && toast.error(err.response.data.Error) }</>
      } catch (error) {
        
      }
    });
};
