import { InlineKeyboard } from 'grammy';
import exOptKb from '../../keyboards/training-plan/exercise-options.js';

export async function handleFinishTraining(ctx) {
  const data = ctx.session.fsm.data;

  data.trainings.push({
    title: `${new Date().toLocaleDateString()}-${data.chatName}-Тренировка ${data.current}`,
    exercises: ctx.session.currentTraining.exercises,
  });

  if (data.current < data.total) {
    data.current++;
    ctx.session.currentTraining = { exercises: [] };
    ctx.session.fsm.state = 'add_exercise';
    return ctx.reply(
      `Тренировка ${data.current} из ${data.total} — выбери, что добавить:`,
      { reply_markup: exOptKb }
    );
  } else {
    ctx.session.fsm.state = 'review_plan';
    return ctx.reply('📋 Все тренировки добавлены. Готов к финальному ревью?', {
      reply_markup: new InlineKeyboard().text('✅ Да', 'plan:review'),
    });
  }
}
