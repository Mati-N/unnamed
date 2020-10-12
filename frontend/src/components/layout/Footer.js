import React, { useContext, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../atoms";

const Footer = () => {
  const { isAuthenticated } = useRecoilValue(authAtom);

  if (isAuthenticated === null) return "";
  return (
    <footer>
      <span>A Social Media App.</span>
      <span>UNNAMED.</span>
      <a href="https://github.com/Mati-N/unnamed">GITHUB.</a>
    </footer>
  );
};

export default Footer;
