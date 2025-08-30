import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    mobile: { type: String, unique: true, required: true }, // instead of email
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
