import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { calculatePrice } from '../utils/calculatePrice';

const ReservationsPage = () => {
  const [, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [surface, setSurface] = useState(0);
  const [typeService, setTypeService] = useState("standard");
  const [niveauSale] = useState("propre");
  const [options] = useState({
    animaux: false,
    urgence: false,
    week_end: false,
    repassage: false,
    vitres: false,
    tapis: false,
  });
  const [prixEstime, setPrixEstime] = useState(null);
  const [photos, setPhotos] = useState([]);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    if (photos.length < 1 || photos.length > 30) {
      toast.error("Ajoutez entre 1 et 30 fichiers (photos ou vidéos).");
      return;
    }

    const formData = new FormData();
    formData.append("typeService", typeService);
    formData.append("surface", surface);
    formData.append("categorie", selectedCategory); // ✅ ajouter catégorie
    formData.append("adresse", e.target.adresse.value);
    formData.append("date", e.target.date.value);
    formData.append("heure", e.target.heure.value);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/reservations", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Réservation envoyée !");
    } catch (err) {
      console.error("Erreur envoi réservation", err);
      toast.error("Erreur lors de la réservation.");
    }
  };

  const groupedCategories = [
    {
      name: 'Nettoyage maison 🏡',
      items: ['Nettoyage maison', 'Repassage', 'Vitres', 'Ménage complet']
    },
    {
      name: 'Voiture 🚗',
      items: ['Nettoyage externe voiture', 'Nettoyage interne voiture']
    },
    {
      name: 'Déménagement 🏠📦',
      items: ['Nettoyage après déménagement', 'Nettoyage après travaux']
    },
    {
      name: 'Bureaux & industriel 🏢',
      items: ['Nettoyage bureaux', 'Nettoyage industriel']
    },
    {
      name: 'Événements 🎉',
      items: ['Nettoyage d’événements']
    },
    {
      name: 'Extérieur & piscine 🌳🏊️',
      items: ['Nettoyage espaces verts', 'Entretien piscine']
    },
    {
      name: 'Autres 🧼',
      items: ['Désinfection', 'Dépoussiérage mobilier', 'Lessive et linge', 'Entretien parties communes']
    }
  ];

  const allCategories = groupedCategories.flatMap(g => g.items);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(window.atob(base64));
        const userId = decodedPayload.id;

        const res = await axios.get(`http://localhost:5001/api/reservations/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: false,
        });

        setReservations(res.data.reservation || []);
        setFilteredReservations(res.data.reservation || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations', error);
        toast.error("Erreur lors du chargement des réservations.");
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    const result = calculatePrice({ surface, typeService, niveauSale, options });
    setPrixEstime(result);
  }, [surface, typeService, niveauSale, options]);

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Réservations</h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">🗕️ Nouvelle réservation</h2>

        <form onSubmit={handleReservationSubmit} className="space-y-4">
          <input
            type="text"
            name="typeService"
            placeholder="Type de service"
            className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            value={typeService}
            onChange={(e) => setTypeService(e.target.value)}
            required
          />
          <input
            type="number"
            name="surface"
            placeholder="Surface (m²)"
            className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            value={surface}
            onChange={(e) => setSurface(Number(e.target.value))}
            required
          />
          {/* ✅ Select Catégorie */}
          <select
            name="categorie"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Choisir une catégorie</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="text"
            name="adresse"
            placeholder="Adresse complète"
            className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            required
          />
          <input type="date" name="date" className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white" required />
          <input type="time" name="heure" className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white" required />

          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={async (e) => {
              const files = Array.from(e.target.files);
              const images = files.filter(file => file.type.startsWith("image/"));
              const videos = files.filter(file => file.type.startsWith("video/"));

              if ((images.length + videos.length) < 1) {
                toast.error("Ajoutez au moins une photo ou vidéo.");
                return;
              }
              if ((images.length + videos.length) > 30) {
                toast.error("Tu peux ajouter jusqu'à 30 fichiers maximum.");
                return;
              }

              const validVideos = [];
              for (let video of videos) {
                const duration = await getVideoDuration(video);
                if (duration < 1 || duration > 120) {
                  toast.error(`La vidéo "${video.name}" doit faire entre 1 et 120 secondes.`);
                  return;
                }
                validVideos.push(video);
              }

              setPhotos([...images, ...validVideos]);
            }}
            className="file-input file-input-bordered w-full"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Ajoutez entre 1 et 30 fichiers (photos ou vidéos).</p>

          {/* ✅ Affichage estimation temporaire */}
          {prixEstime !== null && (
            <p className="text-lg font-semibold text-blue-600">
              Estimation approximative : {prixEstime.toFixed(2)} $
            </p>
          )}

          <button type="submit" className="btn btn-primary">Envoyer la réservation</button>
        </form>
      </div>

      <h2 className="text-2xl font-semibold mt-6">Liste des réservations :</h2>
      {groupedCategories.map((group) => {
        const groupReservations = Array.isArray(filteredReservations)
          ? filteredReservations.filter((r) => group.items.includes(r.categorie))
          : [];

        return (
          <div key={group.name} className="mb-8">
            <h3 className="text-xl font-bold mb-2">{group.name}</h3>
            {groupReservations.map((reservation) => (
              <div key={reservation._id} className="bg-white dark:bg-gray-800 shadow-soft rounded-xl p-4 my-4 text-black dark:text-white">
                <p><strong>Date :</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                <p><strong>Service :</strong> {reservation.service}</p>
                <p><strong>Catégorie :</strong> {reservation.categorie}</p>
                <p><strong>Adresse :</strong> {reservation.adresse}</p>
                <p><strong>Statut :</strong> {reservation.status}</p>
                <p><strong>Prix :</strong> {reservation.prixTotal?.toFixed(2)} $</p>

                {reservation.provider && !['draft', 'en attente', 'en_attente_estimation'].includes(reservation.status) && (
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p><strong>Téléphone du prestataire :</strong> {reservation.provider.phone}</p>
                  </div>
                )}

                {reservation.discountApplied && (
                  <p className="text-green-600 font-semibold">✅ Réduction Premium appliquée !</p>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default ReservationsPage;

