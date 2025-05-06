import React from "react";
import { motion } from "framer-motion";

const ButtonPrimary = ({
  children,
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      className={`bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full shadow-soft transition ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default ButtonPrimary;

