import React, { useState } from "react";
import toast from "react-hot-toast";

const ReservationForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    typeService: "",
    surface: "",
    adresse: "",
    date: "",
    heure: "",
  });
  const [photos, setPhotos] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 50) {
      toast.error("Maximum 50 photos.");
      return;
    }
    setPhotos(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photos.length < 3) {
      toast.error("Veuillez ajouter au moins 3 photos.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl">
      <input type="text" name="typeService" placeholder="Type de service" onChange={handleChange} required />
      <input type="number" name="surface" placeholder="Surface (m²)" onChange={handleChange} required />
      <input type="text" name="adresse" placeholder="Adresse" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="heure" onChange={handleChange} required />

      <input type="file" accept="image/*" multiple onChange={handlePhotoChange} required />
      <p className="text-sm text-gray-500">Ajoutez entre 3 et 50 photos.</p>

      <button type="submit" className="btn btn-primary">Réserver</button>
    </form>
  );
};

export default ReservationForm;

