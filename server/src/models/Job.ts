import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  dateApplied: Date;
  jobLink?: string;
  notes?: string;
}

const JobSchema = new Schema<IJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    dateApplied: { type: Date, default: Date.now },
    jobLink: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>("Job", JobSchema);