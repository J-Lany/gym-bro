import { sendExercisePage } from '../search-by-tag.js';

export default async function handlePrevClick(ctx) {
  ctx.session.page = Math.max((ctx.session.page || 0) - 1, 0);
  await sendExercisePage(ctx);
  await ctx.answerCallbackQuery();
}
