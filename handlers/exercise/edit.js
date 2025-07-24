import Exercise from '../../models/Exercise.js';
import isAdmin from '../admin/access-check.js';
import backButton from '../../keyboards/back-button.js';
import { InlineKeyboard } from 'grammy';
import mainMenu from '../../keyboards/main-menu.js';

export async function handleEditMenu(ctx) {
  await ctx.answerCallbackQuery();
  if (!isAdmin(ctx)) return ctx.reply('❌ Сори, но у тебя нет прав.');

  const docs = await Exercise.find();
  if (!docs.length) return ctx.reply('Упражнений нет.');

  const kb = new InlineKeyboard();
  docs.forEach((e) => kb.text(e.title, `edit_ex:${e._id}`));
  kb.row().text('🔙 Назад', 'menu:back');
  await ctx.reply('Выберите упражнение:', { reply_markup: kb });
}

export async function handleEditField(ctx) {
  await ctx.answerCallbackQuery();
  if (!isAdmin(ctx)) return ctx.reply('❌ Сори, но у тебя нет прав.');

  const ex = await Exercise.findById(ctx.match[1]);

  if (!ex) return ctx.reply('Не найдено.');

  ctx.session.editingExercise = ex;
  ctx.session.step = 'editing_field';

  const kb = new InlineKeyboard()
    .text('Название', 'field:title')
    .text('Описание', 'field:description')
    .row()
    .text('Видео', 'field:video')
    .text('Теги', 'field:tags')
    .row()
    .text('Отмена', 'menu:back');

  await ctx.reply('Что редактируем?', { reply_markup: kb });
}

export async function handleEditValue(ctx) {
  const { step, editField, editingExercise } = ctx.session;
  if (step !== 'editing_value') return;
  if (!isAdmin(ctx)) return ctx.reply('❌ Нет прав.');

  if (editField === 'tags') {
    editingExercise.tags = ctx.message.text.split(',').map((t) => t.trim());
  } else {
    editingExercise[editField] = ctx.message.text;
  }

  await editingExercise.save();

  ctx.session = {};
  await ctx.reply('✅ Сохранено!', { reply_markup: mainMenu });
}

export async function handleEditVideo(ctx) {
  const { step, editField, editingExercise } = ctx.session;

  if (step === 'editing_value' && editField === 'video') {
    if (!isAdmin(ctx)) return ctx.reply('❌ Нет прав.');

    editingExercise.videoFileId = ctx.message.video.file_id;
    await editingExercise.save();

    ctx.session = {};
    return ctx.reply('✅ Видео обновлено!', { reply_markup: mainMenu });
  }
}
