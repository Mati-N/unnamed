import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

const Footer = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading || isAuthenticated == null) return "";
  return <footer>Made by me</footer>;
};

export default Footer;
