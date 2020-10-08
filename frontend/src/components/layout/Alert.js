import React, { useContext } from "react";
import AlertContext from "../../context/alert/AlertContext";
import { Alert as AlertThing } from "@material-ui/lab";

const Alert = () => {
  const { alert_info, removeAlert } = useContext(AlertContext);
  return (
    alert_info && (
      <AlertThing onClose={removeAlert} severity={alert_info.alert_type}>
        {alert_info && alert_info.msg}
      </AlertThing>
    )
  );
};

export default Alert;
