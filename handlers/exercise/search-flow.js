import Exercise from '../../models/Exercise.js';
import backButton from '../../keyboards/back-button.js';
import { InlineKeyboard } from 'grammy';
import mainMenu from '../../keyboards/main-menu.js';
import { matchByWords } from '../../utils/match-by-words.js';
import matchByFuzzyTitle from '../../utils/match-by-fuzzy-title.js';
import showExercise from './show-exercise.js';
import { safeReplyText, safeReplyVideo } from '../utils/safe-replies.js';

export default async function handleSearchText(ctx) {
  const input = ctx.message.text;

  if (input === '🔙 Назад') {
    ctx.session = {};
    return safeReplyText(ctx, '🔙 Возврат в меню', { reply_markup: mainMenu });
  }

  const query = input.trim().toLowerCase();
  const docs = await Exercise.find();

  const wordMatches = matchByWords(query, docs);

  if (wordMatches.length === 1) {
    return showExercise(ctx, wordMatches[0]._id);
  }

  if (wordMatches.length > 1) {
    const kb = new InlineKeyboard();

    wordMatches.slice(0, 5).forEach((ex) => {
      kb.text(ex.title, `show_ex:${ex._id}`);
    });
    kb.row().text('🔙 Назад', 'menu:back');

    return safeReplyVideo(
      ctx,
      ex.videoFileId,
      `🏋🏽‍♀️ <b>${ex.title}</b>\n\n<i>${ex.description}</i>`,
      kb
    );
  }

  const fuzzyMatches = matchByFuzzyTitle(query, docs);

  if (!fuzzyMatches.length) {
    return ctx.reply(
      '😔 Блин, не могу ничего найти. Попробуй переформулировать запрос.',
      {
        reply_markup: backButton,
      }
    );
  }

  if (fuzzyMatches.length === 1) {
    return showExercise(ctx, fuzzyMatches[0]._id);
  }

  const kb = new InlineKeyboard();
  fuzzyMatches.slice(0, 5).forEach((ex) => {
    kb.text(ex.title, `show_ex:${ex._id}`);
  });
  kb.row().text('🔙 Назад', 'menu:back');

  return ctx.reply('🔍 Возможно, ты искал что-то типа этого:', {
    reply_markup: kb,
  });
}
