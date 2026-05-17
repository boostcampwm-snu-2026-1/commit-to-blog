import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    githubUserId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    avatarUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const UserModel = model('User', userSchema);
