import { AWAIT_TAGS, AWAIT_VIDEO } from '../utils/consts.js';
import backButton from '../../keyboards/back-button.js';

export default async function handleUploadVideo(ctx) {
  const { step, exercise } = ctx.session;

  if (step === AWAIT_VIDEO) {
    exercise.videoFileId = ctx.message.video.file_id;
    ctx.session.step = AWAIT_TAGS;

    await ctx.reply(
      '✏️ Укажи категории через запятую (например: Спина, Пресс, Ноги:',
      { reply_markup: backButton }
    );
  }
}
