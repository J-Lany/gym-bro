import TrainingPlan from '../../models/TrainingPlan.js';
import { formatTrainingPlanText } from '../../utils/format-training-plan-text.js';
import { safeReplyText } from '../utils/safe-replies.js';

export async function finishPlan(ctx) {
  const data = ctx.session.fsm.data;

  await TrainingPlan.create({
    title: `${new Date().toLocaleDateString()}-${data.chatName}`,
    chatId: data.chatId,
    chatName: data.chatName,
    authorId: ctx.from.id,
    trainings: data.trainings,
  });

  const message = formatTrainingPlanText(data.trainings);

  try {
    await ctx.api.sendMessage(data.chatId, message, { parse_mode: 'HTML' });
  } catch (err) {
    console.error('Ошибка отправки плана в чат:', err.message);
  }

  delete ctx.session.fsm;
  delete ctx.session.currentTraining;

  return safeReplyText(ctx, 'План сохранён и отправлен в чат!');
}
