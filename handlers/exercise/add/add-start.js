import isAdmin from '../../admin/access-check.js';
import backButton from '../../../keyboards/back-button.js';
import { AWAIT_TITLE } from '../../utils/consts.js';

export default async function handleAddStart(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  if (!isAdmin(ctx)) return ctx.reply('❌ Сори, но у тебя нет прав.');

  ctx.session.step = AWAIT_TITLE;
  ctx.session.exercise = {};

  await ctx.reply('✏️ Введи название упражнения', { reply_markup: backButton });
}
