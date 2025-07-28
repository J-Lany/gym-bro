import { InlineKeyboard } from 'grammy';

export async function reviewTraining(ctx) {
  const training = ctx.session.currentTraining;
  const trainingNumber = ctx.session.fsm.data.current;

  let message = `<b>📋 Тренировка №${trainingNumber}</b>\n\n`;
  const kb = new InlineKeyboard();

  training.exercises.forEach((ex, i) => {
    if (ex.type === 'regular') {
      message += `🏋🏻‍♀️ ${ex.title} — ${ex.sets} подхода по ${ex.reps} повторений\n`;
      message += ex.comment ? `💬 ${ex.comment}\n\n` : '';
    }

    if (ex.type === 'circuit') {
      message += `🏋🏻‍♀️ <b>Круговая</b>. ${ex.rounds} круга\n`;
      ex.items.forEach((item) => {
        message += `   • ${item.title} ${item.reps} повторов\n`;
      });
      message += ex.comment ? `💬 ${ex.comment}\n\n` : '';
    }

    const label = ex.title || `Круговая ${i + 1}`;
    kb.text(`🗑 ${label}`, `delete_exercise:${i}`).row();
  });

  kb.text('✅ Завершить тренировку', 'fsm:finish_training');

  await ctx.reply(message.trim(), {
    parse_mode: 'HTML',
    reply_markup: kb,
  });
}
