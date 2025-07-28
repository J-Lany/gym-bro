import { reviewTraining } from './review-training.js';

export async function deleteExercise(ctx, index) {
  ctx.session.currentTraining.exercises.splice(index, 1);

  ctx.session.fsm.state = 'review_training';
  delete ctx.session.fsm.deleteIndex;

  await ctx.answerCallbackQuery({ text: 'Удалено ✅' });
  await reviewTraining(ctx);
}
