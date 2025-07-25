import mainMenu from '../../keyboards/main-menu.js';
import { goBack } from '../utils/navigation.js';

export default async function handleBack(ctx) {
  await ctx.answerCallbackQuery?.();

  const msg = ctx.callbackQuery?.message;

  if (msg && msg.video) {
    ctx.session = {};
    await ctx.reply('🔙 Окей, мы вернулись в меню:', {
      reply_markup: mainMenu,
    });
  } else {
    await goBack(ctx);
  }
}
