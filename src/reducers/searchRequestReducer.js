import { GET_SMS,GET_EMAIL } from "../actions/types";

const initialState = {
    loading: true,
    success: false,
    error: true,
    data: [],
    count: 0,
}

const searchRequestReducer=(state = initialState, action)=> {
    switch (action.type) {
      case GET_SMS:
        return {
          ...state,
          data: action.payload,
          success:true,
          error:false,
          count:action.payload.count,
          loading:false
        };
      case GET_EMAIL:
        return {
          ...state,
          data: action.payload,
          success:true,
          error:false,
          count:action.payload.count,
          loading:false
        };
      default:
        return state;
    }
  }

export default searchRequestReducer