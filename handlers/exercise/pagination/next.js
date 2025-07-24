import { sendExercisePage } from '../search-by-tag.js';

export default async function handleNextClick(ctx) {
  ctx.session.page = (ctx.session.page || 0) + 1;
  await sendExercisePage(ctx);
  await ctx.answerCallbackQuery();
}
