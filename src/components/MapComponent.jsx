import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 45.5017,
  lng: -73.5673
};

const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Chargement de la carte...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

export default MapComponent;

