import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPricing = () => {
  const [pricingTable, setPricingTable] = useState({});
  const [majorations, setMajorations] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/config/pricing").then((res) => {
      setPricingTable(res.data.pricingTable || {});
      setMajorations(res.data.majorations || {});
    });
  }, []);

  const handleChange = (category, field, value, isMajoration = false) => {
    const updateFn = isMajoration ? setMajorations : setPricingTable;
    const currentData = isMajoration ? majorations : pricingTable;

    updateFn({
      ...currentData,
      [category]: {
        ...currentData[category],
        [field]: parseFloat(value),
      },
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.put("/api/config/pricing", {
        pricingTable,
        majorations,
      });
      setMessage("✅ Tarifs mis à jour avec succès !");
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🧮 Modifier la grille tarifaire</h2>

      {Object.keys(pricingTable).map((cat) => (
        <div key={cat} className="mb-4">
          <h3 className="font-semibold">{cat}</h3>
          {Object.entries(pricingTable[cat]).map(([key, val]) => (
            <input
              key={key}
              type="number"
              className="border p-1 m-1"
              value={val}
              onChange={(e) => handleChange(cat, key, e.target.value)}
            />
          ))}
        </div>
      ))}

      <h2 className="text-xl font-bold mt-6 mb-2">⚠️ Majorations</h2>
      {Object.keys(majorations).map((k) => (
        <div key={k} className="mb-2">
          <label>{k}</label>
          <input
            type="number"
            value={majorations[k]}
            className="border p-1 ml-2"
            onChange={(e) => handleChange(k, null, e.target.value, true)}
          />
        </div>
      ))}

      <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Enregistrer
      </button>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default AdminPricing;

