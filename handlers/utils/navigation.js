import { sendExercisePage } from '../exercise/search-by-tag.js';
import { clearHistory, popFromHistory } from './work-with-history.js';
import handleStart from '../menu/start.js';
import handleList from '../menu/list.js';
import mainMenu from '../../keyboards/main-menu.js';

export async function goBack(ctx) {
  popFromHistory(ctx);

  const lastStep = popFromHistory(ctx);

  if (!lastStep) {
    clearHistory(ctx);
    return handleStart(ctx);
  }

  switch (lastStep) {
    case 'list':
      return handleList(ctx);
    case 'searchByTag':
      return sendExercisePage(ctx);
    case 'mainMenu':
      return handleStart(ctx);
    default:
      clearHistory(ctx);
      await ctx.reply('🔙 Окей, мы вернулись в меню:', {
        reply_markup: mainMenu,
      });
  }
}
