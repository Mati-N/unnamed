import React, { useContext } from "react";
import AlertContext from "../../context/alert/AlertContext";
import { useSpring, animated } from "react-spring";

const Alert = () => {
  const { alert_info } = useContext(AlertContext);
  const animation = useSpring({
    from: { opacity: 0, transform: "scale(0)" },
    to: { opacity: 1, transform: "scale(1)" },
  });

  if (alert_info != null) {
    return (
      <>
        <animated.div
          style={animation}
          className={`app-alert alert-${alert_info.alert_type}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-alert-circle"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#607D8B"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h1 style={{ display: "inline" }}>{alert_info.msg}</h1>
        </animated.div>
      </>
    );
  }
  return null;
};

export default Alert;
