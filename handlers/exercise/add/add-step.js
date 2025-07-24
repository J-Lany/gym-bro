import backButton from '../../../keyboards/back-button.js';
import {
  AWAIT_DISCRIPTION,
  AWAIT_TAGS,
  AWAIT_TITLE,
  AWAIT_VIDEO,
} from '../../utils/consts.js';
import mainMenu from '../../../keyboards/main-menu.js';

export default async function handleAddSteps(ctx) {
  const { step, exercise } = ctx.session;

  if (ctx.message.text === '🔙 Назад') {
    ctx.session = {};
    return ctx.reply('👉 Главное меню:', { reply_markup: mainMenu });
  }

  if (step === AWAIT_TITLE) {
    exercise.title = ctx.message.text;
    ctx.session.step = AWAIT_DISCRIPTION;
    return ctx.reply('✏️  Введи его описание:', { reply_markup: backButton });
  }

  if (step === AWAIT_DISCRIPTION) {
    exercise.description = ctx.message.text;
    ctx.session.step = AWAIT_VIDEO;
    return ctx.reply('📹 Пришли видео упражнения:', {
      reply_markup: backButton,
    });
  }

  if (step === AWAIT_TAGS) {
    exercise.tags = ctx.message.text
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    exercise.authorId = ctx.from.id;
    const exModel = new (await import('../../../models/Exercise.js')).default(
      exercise
    );
    await exModel.save();

    ctx.session = {};
    return ctx.reply('✅ Кайф, упражнение добавлено!', {
      reply_markup: mainMenu,
    });
  }
}
