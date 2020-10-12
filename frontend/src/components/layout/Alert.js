import React from "react";
import { Alert as AlertThing } from "@material-ui/lab";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { alertAtom } from "../../atoms";

const Alert = () => {
  const alert = useRecoilValue(alertAtom);
  const resetAlert = useResetRecoilState(alertAtom);

  return (
    alert.message && (
      <AlertThing onClose={resetAlert} severity={alert.type}>
        {alert.message}
      </AlertThing>
    )
  );
};

export default Alert;
