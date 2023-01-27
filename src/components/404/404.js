import React from "react";
import "../../App.css";
import { useLocation } from "react-router-dom";

const Error = () => {
  const location = useLocation();
  return (
    <div className="Brapper">
      <h1>Error! Cannot GET {location.pathname}</h1>
    </div>
  );
};

export default Error;
