import React, { useReducer } from "react";
import AlertReducer from "./AlertReducer";
import AlertContext from "./AlertContext";
import { SET_ALERT, REMOVE_ALERT } from "../types";

const AlertState = (props) => {
  const initialState = {
    alert_info: null,
  };

  const [state, dispatch] = useReducer(AlertReducer, initialState);
  const setAlert = (msg, alert_type) => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, alert_type },
    });
  };

  const removeAlert = () => {
    dispatch({ type: REMOVE_ALERT });
  };

  return (
    <AlertContext.Provider
      value={{
        alert_info: state.alert_info,
        removeAlert,
        setAlert,
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
