import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 48.8566, // Paris par défaut
  lng: 2.3522,
};

const ProviderTracker = ({ providerId }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [location, setLocation] = useState(null);

  // ✅ Point de départ simulé
  const startPosition = { lat: 48.853, lng: 2.3499 };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`);
        console.log("📍 Position reçue :", res.data.location);
        setLocation(res.data.location);
      } catch (err) {
        console.error("❌ Erreur de localisation :", err.message);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000); // ↻ Rafraîchir toutes les 10 sec
    return () => clearInterval(interval);
  }, [providerId]);

  if (loadError) return <div>❌ Erreur de chargement Google Maps</div>;
  if (!isLoaded) return <div>⌛ Chargement de la carte...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={location || defaultCenter}
      zoom={14}
    >
      {/* 📍 Marqueur prestataire */}
      {location && <Marker position={location} />}

      {/* ➰ Trajet */}
      {location && (
        <Polyline
          path={[startPosition, location]}
          options={{
            strokeColor: "#007bff",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            icons: [
              {
                icon: {
                  path: window?.google?.maps?.SymbolPath?.FORWARD_CLOSED_ARROW || "",
                },
                offset: "100%",
              },
            ],
          }}
        />
      )}
    </GoogleMap>
  );
};

export default ProviderTracker;

