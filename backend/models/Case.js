import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String },
    category: { type: String },
    image: { type: String },
    status: { type: String, default: "pending" },
    donations: { type: Number, default: 0 },
    goal: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);
