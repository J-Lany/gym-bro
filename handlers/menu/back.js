import mainMenu from '../../keyboards/main-menu.js';
import { safeReplyText } from '../utils/safe-replies.js';

export default async function handleBack(ctx) {
  await ctx.answerCallbackQuery?.();

  const msg = ctx.callbackQuery?.message;

  if (msg && msg.video) {
    ctx.session = {};
    await ctx.reply('🔙 Окей, мы вернулись в меню:', {
      reply_markup: mainMenu,
    });
  } else {
    ctx.session = {};
    await safeReplyText(ctx, '🔙 Окей, мы вернулись в меню:', mainMenu);
  }
}
