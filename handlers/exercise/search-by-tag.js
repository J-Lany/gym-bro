import Exercise from '../../models/Exercise.js';
import backButton from '../../keyboards/back-button.js';
import { InlineKeyboard } from 'grammy';
import { capitalizeFirstLetter } from '../utils/capitalize-first-letter.js';
import { safeReplyText } from '../utils/safe-replies.js';
import { pushToHistory } from '../utils/work-with-history.js';

const PAGE_SIZE = 5;

export default async function handleSearchByTag(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  pushToHistory(ctx, 'searchByTag');

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

  if (page > 0) kb.text('<<<<<<', 'tag_page:prev');
  if (end < allExercises.length) kb.text('>>>>>', 'tag_page:next');

  kb.row().text('🔙 Назад', 'menu:back');

  const pageText = `🔹 Упражнения из категории "${capitalizeFirstLetter(tag)}"`;

  await safeReplyText(ctx, pageText, kb);
}
