const Reservation = require('../models/Reservation');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const totalUsers = await User.countDocuments();

    const completedReservations = await Reservation.find({ status: 'completed' });
    const cancelledReservations = await Reservation.find({ status: 'cancelled' });

    const totalRevenue = completedReservations.reduce((acc, res) => acc + (res.amountPaid || 0), 0);
    const cancellationRate = totalReservations === 0
      ? 0
      : (cancelledReservations.length / totalReservations) * 100;

    res.status(200).json({
      totalReservations,
      totalUsers,
      totalRevenue,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats admin :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

