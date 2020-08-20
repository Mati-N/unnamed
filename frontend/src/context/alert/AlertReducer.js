import { SET_ALERT, REMOVE_ALERT } from "../types";

export default (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return {
        alert_info: { ...action.payload },
      };
    case REMOVE_ALERT:
      return {
        alert_info: null,
      };
  }
};
