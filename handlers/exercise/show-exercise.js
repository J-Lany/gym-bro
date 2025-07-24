import Exercise from '../../models/Exercise.js';
import { InlineKeyboard } from 'grammy';

export default async function showExercise(ctx, id) {
  const ex = await Exercise.findById(id);

  if (!ex) return ctx.reply('❌ Упражнение не найдено');

  const kb = new InlineKeyboard()
    .text('✏️ Редактировать', `edit_ex:${ex._id}`)
    .row()
    .text('🔙 Назад', 'menu:back');

  const caption = `🏋🏽‍♀️ <b>${ex.title}</b>\n\n<i>💬 ${ex.description}</i>`;

  if (ctx.callbackQuery?.message) {
    return ctx.editMessageMedia(
      {
        type: 'video',
        media: ex.videoFileId,
        caption,
        parse_mode: 'HTML',
      },
      {
        reply_markup: kb,
      }
    );
  } else {
    return ctx.replyWithVideo(ex.videoFileId, {
      caption,
      parse_mode: 'HTML',
      reply_markup: kb,
    });
  }
}
