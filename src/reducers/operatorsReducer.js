import { GET_OPERATORS } from "../actions/types";

const initialState = {
  loading: true,
  success: false,
  error: true,
  operators: {},
};
const operatorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OPERATORS:
      return {
        ...state,
        success: true,
        error: false,
        loading: false,
        operators: action.payload,
      };

    default:
      return state;
  }
};
export default operatorsReducer;
