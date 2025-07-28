import Exercise from '../../models/Exercise.js';
import { InlineKeyboard } from 'grammy';

export async function promptCircuitCategory(ctx) {
  ctx.session.currentCategory = null;
  ctx.session.fsm = ctx.session.fsm || {};
  ctx.session.fsm.state = 'await_circuit_category';

  const tags = await Exercise.distinct('tags');

  const kb = new InlineKeyboard();
  tags.forEach((tag) => {
    kb.text(tag, `circuit:category:${tag}`).row();
  });

  await ctx.reply('📂 Выбери категорию упражнения:', {
    reply_markup: kb,
  });
}
