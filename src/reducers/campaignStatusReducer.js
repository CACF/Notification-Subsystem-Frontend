import { GET_CAMPAIGN_STATUS } from "../actions/types";

const initialState = {
  loading: true,
  success: false,
  error: true,
  active_queues: {},
  active_tasks: {},
  active_workers: [],
  pending_tasks: {},
};
const campaignStatusdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CAMPAIGN_STATUS:
      return {
        ...state,
        success: true,
        error: false,
        loading: false,
        active_workers: action.payload.active_workers,
        pending_tasks: action.payload.pending_tasks,
        active_tasks: action.payload.active_tasks,
        active_queues: action.payload.active_queues,
      };

    default:
      return state;
  }
};
export default campaignStatusdReducer;
