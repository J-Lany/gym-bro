import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  exerciseId: String,
  title: String,
  sets: Number,
  reps: Number,
  comment: String,
});

const trainingSchema = new mongoose.Schema({
  title: String,
  exercises: [exerciseSchema],
});

const trainingPlanSchema = new mongoose.Schema({
  title: String,
  chatId: String,
  chatName: String,
  authorId: String,
  createdAt: { type: Date, default: Date.now },
  trainings: [trainingSchema],
});

export default mongoose.model('TrainingPlan', trainingPlanSchema);
