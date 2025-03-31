const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },

  // 🌍 Nouvelle structure GeoJSON pour suivi GPS
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 📌 Index géospatial
providerSchema.index({ location: '2dsphere' });

providerSchema.set('timestamps', true);

const Provider = mongoose.model("Provider", providerSchema);
module.exports = Provider;

