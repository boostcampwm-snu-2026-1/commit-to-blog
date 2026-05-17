import { Schema, model, Types } from 'mongoose';

const interviewTurnSchema = new Schema(
  {
    sessionId: { type: Types.ObjectId, ref: 'InterviewSession', required: true },
    turnIndex: { type: Number, required: true },
    question: { type: String, required: true },
    expectedAnswer: { type: String },
    hint: { type: String },
    userAnswer: { type: String },
    actionType: { type: String },
    feedback: { type: String },
    conceptTags: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

interviewTurnSchema.index({ sessionId: 1, turnIndex: 1 }, { unique: true });

export const InterviewTurnModel = model('InterviewTurn', interviewTurnSchema);
