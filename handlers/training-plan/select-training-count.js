import exerciseOptionsKeyboard from '../../keyboards/training-plan/exercise-options.js';
import { safeReplyText } from '../utils/safe-replies.js';

export default async function handleSelectTrainingCount(ctx) {
  const count = Number(ctx.match[1]);
  const data = ctx.session.fsm?.data;

  if (!data) return ctx.reply('Что-то пошло не так. Начни заново.');

  data.trainings = [];
  data.total = count;
  data.current = 1;
  ctx.session.fsm.state = 'add_exercise';

  await ctx.answerCallbackQuery();
  return safeReplyText(
    ctx,
    `Тренировка ${data.current} из ${data.total} — выбери, что добавить:`,
    exerciseOptionsKeyboard
  );
}
