import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-3xl px-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;

