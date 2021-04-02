import * as searchRequests from "../api/SearchRequestService";
import { GET_SMS, GET_EMAIL } from "./types";
import { errors } from "./../utilities/helpers";


export const getSMSAction = (data) => {
  return {
    type: GET_SMS,
    payload: data,
  };
};
export const getEmailAction = (data) => {
  return {
    type: GET_EMAIL,
    payload: data,
  };
};

// get SMS List
export const getSMSList = (config, params) => (dispatch) => {

   
  const response = searchRequests.getSMSAPI(
    config,
    params.start,
    params.limit,
    params.search
  );
 

  response
    .then((response) => {
      if (response.status === 200) { 
        dispatch(getSMSAction(response.data));
      }
    })
    .catch((error) => errors(this,error.message));
};
// get Email List
export const getEmailList = (config, params) => (dispatch) => {
   console.log("checekd",params,);

  const response = searchRequests.getEmailAPI(
    config,
    params.start,
    params.limit,
    params.search
  );

  response
    .then((response) => {
      if (response.status === 200) {
        dispatch(getEmailAction(response.data));
      }
    })
    .catch((error) => errors(this, error));
};
