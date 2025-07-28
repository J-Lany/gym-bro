import { InlineKeyboard } from 'grammy';
import { formatTrainingPlanText } from '../../utils/format-training-plan-text.js';

export async function reviewPlan(ctx) {
  const data = ctx.session.fsm.data;
  const message = formatTrainingPlanText(data.trainings);

  ctx.session.fsm.state = 'review_plan';

  const kb = new InlineKeyboard();
  data.trainings.forEach((_, i) => {
    kb.text(
      `🗑 Удалить тренировку №${i + 1}`,
      `plan:delete_training:${i}`
    ).row();
  });
  kb.text('💾 Сохранить', 'plan:finish');

  return ctx.reply(message.trim(), {
    parse_mode: 'HTML',
    reply_markup: kb,
  });
}
