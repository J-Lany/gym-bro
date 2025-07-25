import mainMenu from '../../keyboards/main-menu.js';
import { clearHistory } from '../utils/work-with-history.js';

export default async function handleStart(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  clearHistory(ctx);

  await ctx.reply('👋🏾 Привет-привет! Чё делаем? Выбирай:', {
    reply_markup: mainMenu,
  });
}
