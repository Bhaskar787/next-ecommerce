import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev
export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);