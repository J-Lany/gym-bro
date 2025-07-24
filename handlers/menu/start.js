import mainMenu from '../../keyboards/main-menu.js';

export default async function handleStart(ctx) {
  if (ctx.callbackQuery) {
    await ctx.answerCallbackQuery();
  }

  await ctx.reply('👋🏾 Привет-привет! Чё делаем? Выбирай:', {
    reply_markup: mainMenu,
  });
}
