import 'dotenv/config';
import mongoose from 'mongoose';
import { Bot, session, GrammyError, HttpError } from 'grammy';
import handleStart from './handlers/menu/start.js';
import handleList from './handlers/menu/list.js';
import handleBack from './handlers/menu/back.js';
import handleAddStart from './handlers/exercise/add/add-start.js';
import handleSearchByTag from './handlers/exercise/search-by-tag.js';
import handleSearchButton from './handlers/menu/search.js';
import backButton from './keyboards/back-button.js';
import handleAddSteps from './handlers/exercise/add/add-step.js';
import handleUploadVideo from './handlers/exercise/upload-video.js';
import handleSearchText from './handlers/exercise/search-flow.js';
import {
  handleEditField,
  handleEditValue,
  handleEditVideo,
} from './handlers/exercise/edit.js';
import {
  AWAIT_DISCRIPTION,
  AWAIT_TAGS,
  AWAIT_TITLE,
  AWAIT_VIDEO,
} from './handlers/utils/consts.js';
import handleNextClick from './handlers/exercise/pagination/next.js';
import handlePrevClick from './handlers/exercise/pagination/previous.js';
import showExercise from './handlers/exercise/show-exercise.js';
import {
  handleExercisePageChange,
  handleExerciseSelected,
  handleTagSelected,
  startAddExercise,
} from './handlers/training-plan/add-exercise-to-training.js';
import {
  handleCircuitCategory,
  handleCircuitDone,
  handleCircuitExercise,
  handleCircuitRounds,
  handleStartCircuit,
} from './handlers/training-plan/add-circuit.js';
import { reviewPlan } from './handlers/training-plan/review-plan.js';
import { deleteExercise } from './handlers/training-plan/delete-exercise.js';
import {
  applyEdit,
  handleEditExercise,
} from './handlers/training-plan/edit-exercise.js';
import createPlanStart from './handlers/training-plan/create-plan-start.js';
import fsmPlan from './handlers/training-plan/fsm-plan.js';
import handleSelectTrainingCount from './handlers/training-plan/select-training-count.js';
import { promptCircuitCategory } from './handlers/training-plan/prompt-circuit-category.js';
import { finishPlan } from './handlers/training-plan/finish-plan.js';

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'));

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(session({ initial: () => ({}) }));

bot.api.setMyCommands([
  { command: 'start', description: '🚀 Главное меню' },
  { command: 'list', description: '📂 Категории упражнений' },
  { command: 'search', description: '🔍 Поиск упражнения по названию' },
  { command: 'add', description: '➕ Добавить новое упражнение' },
  { command: 'create', description: '📝 Создать план' },
]);

bot.command('start', handleStart);
bot.command('add', handleAddStart);
bot.command('list', handleList);
bot.command('search', handleSearchButton);
bot.command('create', createPlanStart);

bot.callbackQuery('menu:list', handleList);
bot.callbackQuery('menu:search', handleSearchButton);
bot.callbackQuery('menu:back', handleBack);
bot.callbackQuery('menu:add', handleAddStart);
bot.callbackQuery(/^tag:(.+)/, handleSearchByTag);

bot.callbackQuery(/^edit_ex:(.+)/, handleEditField);
bot.callbackQuery('tag_page:next', handleNextClick);

bot.callbackQuery('tag_page:prev', handlePrevClick);
bot.callbackQuery(/^field:(.+)/, async (ctx) => {
  ctx.session.editField = ctx.match[1];
  ctx.session.step = 'editing_value';
  await ctx.reply(`Введите новое ${ctx.match[1]}:`, {
    reply_markup: backButton,
  });
});

bot.callbackQuery(/^fsm_tag:(.+)/, async (ctx) => {
  const tag = ctx.match[1];
  await handleTagSelected(ctx, tag);
});

bot.callbackQuery('fsm_ex_page:next', (ctx) =>
  handleExercisePageChange(ctx, 'next')
);
bot.callbackQuery('fsm_ex_page:prev', (ctx) =>
  handleExercisePageChange(ctx, 'prev')
);
bot.callbackQuery('fsm:tag_back', (ctx) => startAddExercise(ctx));

bot.callbackQuery(/^fsm_ex:(.+)/, async (ctx) => {
  const id = ctx.match[1];
  await handleExerciseSelected(ctx, id);
});

bot.callbackQuery(/^fsm:training_count:(\d)$/, handleSelectTrainingCount);

bot.callbackQuery('menu:create_plan', async (ctx) => {
  await createPlanStart(ctx);
});

bot.callbackQuery('fsm:add_exercise', async (ctx) => {
  await ctx.answerCallbackQuery();
  await startAddExercise(ctx);
});

bot.callbackQuery('fsm:add_circuit', async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleStartCircuit(ctx);
});

bot.callbackQuery(/^circuit:rounds:(\d)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleCircuitRounds(ctx);
});

bot.callbackQuery(/^circuit:category:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleCircuitCategory(ctx);
});

bot.callbackQuery(/^circuit:ex:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleCircuitExercise(ctx);
});

bot.callbackQuery('circuit:add', async (ctx) => {
  await ctx.answerCallbackQuery();
  await promptCircuitCategory(ctx);
});

bot.callbackQuery('circuit:done', async (ctx) => {
  await ctx.answerCallbackQuery();
  await handleCircuitDone(ctx);
});

bot.callbackQuery('plan:review', async (ctx) => {
  await reviewPlan(ctx);
});

bot.callbackQuery('fsm:review_training', async (ctx) => {
  ctx.session.fsm.state = 'review_training';
  return fsmPlan(ctx);
});

bot.callbackQuery('fsm:finish_training', async (ctx) => {
  ctx.session.fsm.state = 'finish_training';
  return fsmPlan(ctx);
});

bot.callbackQuery(/^edit_exercise:(\d+)$/, async (ctx) => {
  ctx.session.fsm.state = 'edit_exercise';
  ctx.session.fsm.editIndex = Number(ctx.match[1]);
  return fsmPlan(ctx);
});

bot.callbackQuery(/^delete_exercise:(\d+)$/, async (ctx) => {
  ctx.session.fsm.state = 'delete_exercise';
  ctx.session.fsm.deleteIndex = Number(ctx.match[1]);
  return fsmPlan(ctx);
});

bot.callbackQuery(/^plan:delete_training:(\d+)$/, async (ctx) => {
  ctx.session.fsm.state = 'delete_training';
  ctx.session.fsm.deleteIndex = Number(ctx.match[1]);
  return fsmPlan(ctx);
});

bot.callbackQuery('plan:finish', async (ctx) => {
  await finishPlan(ctx);
});

bot.callbackQuery(/^delete_ex:(\d+)$/, async (ctx) => {
  const i = Number(ctx.match[1]);
  await deleteExercise(ctx, i);
});

bot.callbackQuery(/^edit_ex:(\d+)$/, async (ctx) => {
  const i = Number(ctx.match[1]);
  await handleEditExercise(ctx, ctx.session.currentTraining, i);
});

bot.callbackQuery(/^edit:(sets|reps|comment)$/, async (ctx) => {
  ctx.session.state = 'editing_ex_value';
  ctx.session.editingField = ctx.match[1];
  await ctx.reply(`Введите новое значение для ${ctx.match[1]}:`);
});

bot.on('message:text', async (ctx) => {
  const step = ctx.session.step;
  const fsmState = ctx.session.fsm?.state;

  if (fsmState) return fsmPlan(ctx);

  if ([AWAIT_TITLE, AWAIT_DISCRIPTION, AWAIT_TAGS].includes(step)) {
    return handleAddSteps(ctx);
  }

  if (ctx.session.state === 'editing_ex_value') {
    const field = ctx.session.editingField;
    const value = ctx.message.text.trim();
    await applyEdit(ctx, field, value);
  }

  if (step === 'editing_value') {
    return handleEditValue(ctx);
  }

  return handleSearchText(ctx);
});

bot.on('message:video', async (ctx) => {
  const step = ctx.session.step;

  if (step === AWAIT_VIDEO) {
    return handleUploadVideo(ctx);
  }

  if (step === 'editing_value' && ctx.session.editField === 'video') {
    return handleEditVideo(ctx);
  }

  return ctx.reply('❗ Я не ожидала видео. Используй меню.');
});

bot.callbackQuery(/^show_ex:(.+)/, async (ctx) => {
  if (ctx.callbackQuery) await ctx.answerCallbackQuery();
  return showExercise(ctx, ctx.match[1]);
});

bot.catch((error) => {
  const ctx = error.ctx;
  console.error(`Error with hadling update ${ctx.update.update_id}`);

  const e = error.error;

  if (e instanceof GrammyError) {
    console.error(`Error in request: ${e.description}`);
  } else if (e instanceof HttpError) {
    console.error(`Couldn't contact Telegram: ${e}`);
  } else {
    console.error(`Unexpected error: ${e}`);
  }
});

bot.start();
