import { reviewPlan } from './review-plan.js';

export async function deleteTraining(ctx, index) {
  const trainings = ctx.session.fsm?.data?.trainings;

  if (!trainings || !trainings[index]) {
    return ctx.answerCallbackQuery({
      text: '❗ Не удалось удалить тренировку',
      show_alert: true,
    });
  }

  trainings.splice(index, 1);

  await ctx.answerCallbackQuery({ text: 'Удалено ✅' });
  ctx.session.fsm.state = 'review_plan';
  return reviewPlan(ctx);
}
