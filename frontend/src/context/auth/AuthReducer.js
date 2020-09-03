import {
  LOGIN,
  LOGOUT,
  SET_LOADING
} from "../types";
import Cookies from "js-cookie";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      Cookies.set("JWT", action.payload.token);
      Cookies.set("JWT-refresh-token", action.payload.refreshToken);
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT:
      Cookies.remove("JWT");
      Cookies.return("JWT-refresh-token");
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