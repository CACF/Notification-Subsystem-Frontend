import * as operators from "../api/operatorsServices";
import { GET_OPERATORS } from "./types";
import { errors } from "../utilities/helpers";

export const operatorActions = (data) => {
  return {
    type: GET_OPERATORS,
    payload: data,
  };
};
export const getOperatorsList = (config) => (dispatch) => {
  const response = operators.getOperatorsAPI(config);
  response
    .then((res) => {
      if (res.status === 200) {
        dispatch(operatorActions(res.data));
      }
    })
    .catch((err) => errors(this, err));
};