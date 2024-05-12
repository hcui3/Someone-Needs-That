/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";

const ContentWrapper = ({ children, open }) => {
  const transitionStyle = {
    transition: "margin-left 300ms linear",
  };
  const location = useLocation();
  const classes = location.pathname === "/" ? "" : `${open ? "ml-36" : "ml-12"} pt-20`;
  return (
    <>
      <div className={classes} style={transitionStyle}>
        {children}
      </div>
    </>
  );
};

export default ContentWrapper;
