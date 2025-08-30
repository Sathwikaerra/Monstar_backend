import express from 'express';
import Ride from '../models/Ride.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create ride
router.post('/add', auth, async (req, res) => {
  try {
    const { toWhom, rideDate, amount, paid } = req.body;
    console.log(req.body)

    const ride = await Ride.create({
      userId: req.user.id,
      toWhom,
      rideDate: new Date(rideDate),
      amount,
      paid: !!paid
    });
    res.json({ ok: true, data: ride });
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});

// List rides + computed fields
router.get('/', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.user.id }).sort({ rideDate: -1 });

    const data = rides.map(r => {
      const daysSince = Math.floor((Date.now() - new Date(r.rideDate).getTime()) / (1000*60*60*24));
      const remaining = r.paid ? 0 : r.amount;
      return { ...r.toObject(), daysSince, remaining };
    });

    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});



// GET ride by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });
    res.json({ ok: true, data: ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH update ride by ID
router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { toWhom, amount, paid, rideDate } = req.body;

    const updatedRide = await Ride.findByIdAndUpdate(
      id,
      { toWhom, amount, paid, rideDate },
      { new: true, runValidators: true }
    );

    if (!updatedRide) return res.status(404).json({ message: "Ride not found" });

    res.json({ ok: true, data: updatedRide, message: "Ride updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
