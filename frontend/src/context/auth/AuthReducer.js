import {
  LOGIN,
  LOGOUT,
  SET_LOADING
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
          logout: true,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: false,
      };
  }
};