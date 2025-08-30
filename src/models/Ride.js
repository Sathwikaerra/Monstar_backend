import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  toWhom: { type: String, required: true },
  rideDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Ride', rideSchema);
