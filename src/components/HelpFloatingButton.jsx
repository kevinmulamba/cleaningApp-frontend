import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "../context/MessageContext";

export default function HelpFloatingButton() {
  const navigate = useNavigate();
  const { hasNewMessage } = useMessageContext();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => navigate("/chat")}
        className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
      >
        <HelpCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Besoin d’aide ?</span>

        {/* 🔴 Badge si message non lu */}
        {hasNewMessage && (
          <>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </>
        )}
      </button>
    </div>
  );
}

