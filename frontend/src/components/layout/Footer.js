import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

const Footer = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading || isAuthenticated == null) return "";
  return (
    <footer>
      <span>A Social Media App.</span>
      <span>UNNAMED.</span>
      <a href="https://github.com/Mati-N/unnamed">GITHUB.</a>
    </footer>
  );
};

export default Footer;
