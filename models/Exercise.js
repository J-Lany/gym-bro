import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoFileId: String,
  tags: [String],
  authorId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Exercise', exerciseSchema);
