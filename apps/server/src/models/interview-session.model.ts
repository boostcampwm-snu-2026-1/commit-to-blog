import { Schema, model, Types } from 'mongoose';

const interviewSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    repoFullName: { type: String, required: true },
    commitSha: { type: String, required: true },
    status: { type: String, required: true, default: 'READY' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

interviewSessionSchema.index({ userId: 1, createdAt: -1 });

export const InterviewSessionModel = model('InterviewSession', interviewSessionSchema);
