import { InlineKeyboard } from 'grammy';
import Exercise from '../../models/Exercise.js';

export default async function handleList(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  const docs = await Exercise.find();
  const tags = [...new Set(docs.flatMap((e) => e.tags))];

  if (!tags.length) {
    return ctx.reply('Нет доступных тегов');
  }

  const keyboard = new InlineKeyboard();
  tags.forEach((tag) => keyboard.text(tag, `tag:${tag}`).row());
  keyboard.row().text('🔙 Назад', 'menu:back');

  await ctx.reply('Выбери категорию:', { reply_markup: keyboard });
}
