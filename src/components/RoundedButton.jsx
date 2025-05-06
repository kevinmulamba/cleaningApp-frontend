import React from "react";

const RoundedButton = ({ children, onClick, className = "", type = "button", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full px-6 py-3 font-semibold transition-colors duration-300 text-white bg-blue-600 hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default RoundedButton;

