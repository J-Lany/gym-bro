import Exercise from '../../models/Exercise.js';
import backButton from '../../keyboards/back-button.js';
import { InlineKeyboard } from 'grammy';

const PAGE_SIZE = 5;

export default async function handleSearchByTag(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  const tag = ctx.match[1];

  ctx.session.tag = tag;
  ctx.session.page = 0;

  await sendExercisePage(ctx);
}

export async function sendExercisePage(ctx) {
  const tag = ctx.session.tag;
  const page = ctx.session.page || 0;

  const allExercises = await Exercise.find({ tags: tag });
  if (!allExercises.length) {
    return ctx.reply('Нет упражнений с такой категорией', {
      reply_markup: backButton,
    });
  }

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageExercises = allExercises.slice(start, end);

  const kb = new InlineKeyboard();
  pageExercises.forEach((ex) => {
    kb.text(ex.title, `show_ex:${ex._id}`).row();
  });

  if (page > 0) kb.text('⬅️ Назад', 'tag_page:prev');
  if (end < allExercises.length) kb.text('➡️ Вперёд', 'tag_page:next');

  kb.row().text('🔙 Назад', 'menu:back');

  const pageText = `🏷 Упражнения с категорией "${tag}"`;

  if (ctx.callbackQuery) {
    await ctx.editMessageText(pageText, {
      reply_markup: kb,
      parse_mode: 'HTML',
    });
  } else {
    await ctx.reply(pageText, {
      reply_markup: kb,
      parse_mode: 'HTML',
    });
  }
}
