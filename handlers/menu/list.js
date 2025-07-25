import { InlineKeyboard } from 'grammy';
import Exercise from '../../models/Exercise.js';
import { capitalizeFirstLetter } from '../utils/capitalize-first-letter.js';
import { pushToHistory } from '../utils/work-with-history.js';

export default async function handleList(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  pushToHistory(ctx, 'list');

  const docs = await Exercise.find();
  const tags = [...new Set(docs.flatMap((e) => e.tags))];

  if (!tags.length) {
    return ctx.reply('Нет доступных тегов');
  }

  const keyboard = new InlineKeyboard();
  tags.forEach((tag) =>
    keyboard.text(`🔸 ${capitalizeFirstLetter(tag)}`, `tag:${tag}`).row()
  );
  keyboard.row().text('🔙 Назад', 'menu:back');

  await ctx.reply('🔸 Выбери категорию:', { reply_markup: keyboard });
}
