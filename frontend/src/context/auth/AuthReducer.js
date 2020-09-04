import {
  LOGIN,
  LOGOUT,
  SET_LOADING
} from "../types";
import Cookies from "js-cookie";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      Cookies.set("token", action.payload.token);
      Cookies.set("refresh-token", action.payload.refreshToken);
      localStorage.setItem("USER", action.payload.user.id)
      return {
        ...state,
        isAuthenticated: true,
      };
    case LOGOUT:
      Cookies.remove("JWT");
      Cookies.remove("JWT-refresh-token");
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