import { Schema, model, Types } from 'mongoose';

const postSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    sessionId: { type: Types.ObjectId, ref: 'InterviewSession' },
    repoFullName: { type: String, required: true },
    commitSha: { type: String, required: true },
    title: { type: String, required: true },
    contentMarkdown: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

postSchema.index({ userId: 1, updatedAt: -1 });

export const PostModel = model('Post', postSchema);
