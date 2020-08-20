import { LOGIN, LOGOUT, SET_LOADING } from "../types";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT:
      localStorage.setItem("TOKEN", "null");
      localStorage.setItem("REFRESH_TOKEN", "null");
      localStorage.setItem("USER", "null");
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
