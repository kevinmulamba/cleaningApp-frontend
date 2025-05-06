import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000"); // Adresse du backend

const TrajetComponent = () => {
    const [trajet, setTrajet] = useState(null);

    useEffect(() => {
        // Envoyer une requête au backend
        socket.emit("demande-trajet", {
            adresse_depart: "Rue A",
            adresse_arrivee: "Rue B"
        });

        // Recevoir la réponse de l'API ML via WebSocket
        socket.on("trajet-optimise", (data) => {
            setTrajet(data);
        });

        return () => {
            socket.off("trajet-optimise");
        };
    }, []);

    return (
        <div>
            <h2>Trajet Optimisé</h2>
            {trajet ? (
                <p>Temps estimé : {trajet.temps_estime} min</p>
            ) : (
                <p>Calcul en cours...</p>
            )}
        </div>
    );
};

export default TrajetComponent;

