import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

const MessageContext = createContext();
const socket = io(process.env.REACT_APP_API_URL);

export const MessageProvider = ({ children }) => {
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // ✅ Réinitialiser les messages non lus quand on arrive sur /chat
    if (location.pathname === "/chat") {
      setHasNewMessage(false);
    }
  }, [location]);

  useEffect(() => {
    socket.on("receive-message", () => {
      if (location.pathname !== "/chat") {
        setHasNewMessage(true);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [location]);

  return (
    <MessageContext.Provider value={{ hasNewMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);

