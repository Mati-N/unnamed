import React, { useState } from "react";
import { UPDATE_USER } from "../../Queries";
import { useMutation } from "@apollo/client";

const CustomizeAccount = () => {
  const [state, setState] = useState({
    password,
    newPassword,
    newUsername,
  });
  const doCustomize = useMutation(UPDATE_USER);

  return <div></div>;
};

export default CustomizeAccount;
