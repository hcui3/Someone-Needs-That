/* eslint-disable react/prop-types */
import { ShopContext } from "../Context/ShopContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

const ContentWrapper = ({ children }) => {
  const { open } = useContext(ShopContext);
  const location = useLocation();
  const transitionStyle = {
    transition: "margin-left 300ms linear",
  };

  const classes = location.pathname === "/" ? "" : `${open ? "ml-36" : "ml-12"} pt-20`;

  return (
    <div className={classes} style={transitionStyle}>
      {children}
    </div>
  );
};

export default ContentWrapper;
