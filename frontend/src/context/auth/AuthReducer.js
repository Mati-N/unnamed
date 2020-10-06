import { LOGIN, LOGOUT, SET_LOADING } from "../types";
import Cookies from "js-cookie";

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      if (!action.refresh) {
        Cookies.set("token", action.payload.token);
        Cookies.set("USER-ID", action.payload.user.id);
      }
      Cookies.set("refresh-token", action.payload.refreshToken);
      return {
        ...state,
        isAuthenticated: true,
        user: !action.refresh ? action.payload.user.id : state.user,
      };
    case LOGOUT:
      Cookies.remove("token");
      Cookies.remove("refresh-token");
      Cookies.remove("USER-ID");
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
