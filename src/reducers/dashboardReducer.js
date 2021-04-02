import {SET_DASHBOARD_COUNTERS,SET_COMPLETED_CAMPAIGNS } from "../actions/types";

const initialState = {
    loading: true,
    success: false,
    error: true,
    active_queues:{},
    active_tasks:{},
    active_workers:[],
    pending_tasks:{},
    counters:{},
    completedCamaigns:{},
   

}
const dashboardReducer=(state = initialState, action)=> {

  switch (action.type) {
    case SET_DASHBOARD_COUNTERS:
      return {
        ...state,
        success: true,
        counters:action.payload,
        error:false,
        loading:false,
      };
      case SET_COMPLETED_CAMPAIGNS:
        return {
          ...state,
          success: true,
          completedCamaigns: action.payload,
          error:false,
          loading:false,
         
         
        };
     
      default:
        return state;
    }
  }
  export default dashboardReducer