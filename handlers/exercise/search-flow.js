import Exercise from '../../models/Exercise.js';
import backButton from '../../keyboards/back-button.js';
import { InlineKeyboard } from 'grammy';
import { matchByWords } from '../../utils/match-by-words.js';
import matchByFuzzyTitle from '../../utils/match-by-fuzzy-title.js';
import showExercise from './show-exercise.js';
import { safeReplyText } from '../utils/safe-replies.js';
import { pushToHistory } from '../utils/work-with-history.js';
import { goBack } from '../utils/navigation.js';

export default async function handleSearchText(ctx) {
  const input = ctx.message.text;

  if (input !== '🔙 Назад') {
    pushToHistory(ctx, 'searchText');
  }

  if (input === '🔙 Назад') {
    return goBack(ctx);
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
      kb.text(ex.title, `show_ex:${ex._id}`).row();
    });
    kb.row().text('🔙 Назад', 'menu:back');

    return safeReplyText(
      ctx,
      '🔍  Лучше уточнить вопрос, но, возможно, ты в поиске чего-то типа этого:',
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
