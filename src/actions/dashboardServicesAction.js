import * as dashboardServices from '../api/DashboardServices'
import {SET_DASHBOARD_COUNTERS,SET_COMPLETED_CAMPAIGNS } from "./types";
import { errors } from "../utilities/helpers";




export const dashboardCountersAction = data => {
  return {
      type: SET_DASHBOARD_COUNTERS,
      payload: data
  };
};
export const dashboardCompletedCamaignsAction = data => {
  return {
      type: SET_COMPLETED_CAMPAIGNS,
      payload: data
  };
};







export const getDashboardCounters = (config) => dispatch => {
 
  const response = dashboardServices.getDashboardCountersAPI(config);
  response.then(res =>
    {if (res.status === 200) { 
      
      dispatch(dashboardCountersAction(res.data))   
    }}
    )
    .catch(err =>
      errors(this, err)
      );
    };
    
    export const getCompletedCampaignsList = (config, params) => (dispatch) => {

  const response = dashboardServices.getCompletedCampaignsAPI(
    config,
    params.start,
    params.limit,
  );
 

  response
    .then((response) => {
      if (response.status === 200) { 

        dispatch(dashboardCompletedCamaignsAction(response.data));
      }
    })
    .catch((error) => errors(this,error.message));
};





