import React from "react";

const PageTitle = ({ children }) => {
  return (
    <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-yellow-400 mb-6 text-center md:text-left">
      {children}
    </h1>
  );
};

export default PageTitle;

