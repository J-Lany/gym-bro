import backButton from '../../keyboards/back-button.js';
import { safeReplyText } from '../utils/safe-replies.js';

export default async function handleSearchButton(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  await safeReplyText(ctx, '🔍 Давай название упражнения:', backButton);
}
