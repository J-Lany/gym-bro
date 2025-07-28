import Exercise from '../../models/Exercise.js';
import { InlineKeyboard } from 'grammy';
import { capitalizeFirstLetter } from '../utils/capitalize-first-letter.js';
import { safeReplyText } from '../utils/safe-replies.js';
import exOptKb from '../../keyboards/training-plan/exercise-options.js';

const PAGE_SIZE = 5;
export async function startAddExercise(ctx) {
  ctx.session.fsm.state = 'select_tag';
  const allTags = await Exercise.distinct('tags');

  const kb = new InlineKeyboard();
  allTags.forEach((tag) => {
    kb.text(capitalizeFirstLetter(tag), `fsm_tag:${tag}`).row();
  });
  kb.text('🔙 Назад', 'fsm:back');

  await ctx.reply('Выбери категорию упражнения:', {
    reply_markup: kb,
  });
}

export async function handleTagSelected(ctx, tag) {
  ctx.session.fsm.selectedTag = tag;
  ctx.session.fsm.tagPage = 0;
  ctx.session.fsm.state = 'select_exercise';
  await sendExercisePage(ctx);
}

export async function sendExercisePage(ctx) {
  const tag = ctx.session.fsm.selectedTag;
  const page = ctx.session.fsm.tagPage || 0;

  const allExercises = await Exercise.find({ tags: tag });
  if (!allExercises.length) {
    return ctx.reply('Нет упражнений в этой категории.');
  }

  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageExercises = allExercises.slice(start, end);

  const kb = new InlineKeyboard();

  pageExercises.forEach((ex) => {
    kb.text(ex.title, `fsm_ex:${ex._id}`).row();
  });

  if (page > 0) kb.text('⬅️ Назад', 'fsm_ex_page:prev');
  if (end < allExercises.length) kb.text('➡️ Вперёд', 'fsm_ex_page:next');
  kb.row().text('🔙 К категориям', 'fsm:tag_back');

  const msg = `📂 Упражнения из категории "${capitalizeFirstLetter(tag)}"`;
  await safeReplyText(ctx, msg, kb);
}

export async function handleExercisePageChange(ctx, direction) {
  ctx.session.fsm.tagPage += direction === 'next' ? 1 : -1;
  await sendExercisePage(ctx);
}

export async function handleExerciseSelected(ctx, exId) {
  const ex = await Exercise.findById(exId);
  if (!ex) return ctx.reply('❌ Упражнение не найдено');

  ctx.session.fsm.selectedExercise = ex;
  ctx.session.fsm.state = 'set_sets';

  return ctx.reply('🔢 Введи количество подходов:');
}

export async function handleSetsInput(ctx) {
  const text = ctx.message.text.trim();
  if (!/^\d+$/.test(text)) return ctx.reply('Введите число подходов');

  ctx.session.fsm.data.sets = text;
  ctx.session.fsm.state = 'set_reps';

  return ctx.reply('🔁 Введи количество повторений:');
}

export async function handleRepsInput(ctx) {
  const text = ctx.message.text.trim();
  if (!/^\d+$/.test(text)) return ctx.reply('Введите число повторений');

  ctx.session.fsm.data.reps = text;
  ctx.session.fsm.state = 'set_comment';

  return ctx.reply('🗒 Добавь комментарий (или "-" если без него):');
}

export async function handleCommentInput(ctx) {
  const comment = ctx.message.text.trim();
  const data = ctx.session.fsm.data;
  const ex = ctx.session.fsm.selectedExercise;

  if (!ctx.session.currentTraining) {
    ctx.session.currentTraining = { exercises: [] };
  }

  ctx.session.currentTraining.exercises.push({
    type: 'regular',
    exerciseId: ex._id,
    title: ex.title,
    sets: data.sets,
    reps: data.reps,
    comment: comment === '-' ? '' : comment,
  });

  ctx.session.fsm.state = 'add_exercise';

  return safeReplyText(ctx, '✅ Упражнение добавлено! Что дальше?', exOptKb);
}
