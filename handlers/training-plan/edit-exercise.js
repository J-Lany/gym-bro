export async function handleEditExercise(ctx, training, exIndex) {
  ctx.session.state = 'EDITING_EX';
  ctx.session.editingIndex = exIndex;

  await ctx.reply('Что изменить:\n1. Подходы\n2. Повторы\n3. Комментарий', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✏️ Подходы', callback_data: 'edit:sets' },
          { text: '✏️ Повторы', callback_data: 'edit:reps' },
        ],
        [{ text: '✏️ Комментарий', callback_data: 'edit:comment' }],
        [{ text: '🔙 Назад', callback_data: 'fsm:back' }],
      ],
    },
  });
}

export async function applyEdit(ctx, field, value) {
  const training = ctx.session.currentTraining;
  const idx = ctx.session.editingIndex;
  training.exercises[idx][field] = value;

  ctx.session.state = 'await_exercise_option';
  await ctx.reply('✅ Изменения сохранены');
}
