import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const FaceCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    setImage(screenshot);
    if (onCapture) onCapture(screenshot); // ✅ Envoie l'image au parent si besoin
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 300,
          height: 300,
          facingMode: "user",
        }}
        className="rounded shadow"
      />
      <button
        onClick={capture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        📸 Capturer le visage
      </button>

      {image && (
        <div className="mt-4">
          <p className="text-sm mb-2 text-center">Aperçu :</p>
          <img src={image} alt="Selfie capturé" className="rounded shadow-md w-48" />
        </div>
      )}
    </div>
  );
};

export default FaceCapture;

