import 'dotenv/config';
import mongoose from 'mongoose';
import { Bot, session, GrammyError, HttpError, InlineKeyboard } from 'grammy';
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
  handleEditMenu,
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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'));

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(session({ initial: () => ({}) }));

bot.api.setMyCommands([
  { command: 'start', description: '🚀 Главное меню' },
  { command: 'list', description: '📋 Категории упражнений' },
  { command: 'search', description: '🔍 Поиск упражнения по названию' },
  { command: 'add', description: '➕ Добавить новое упражнение' },
]);

bot.command('start', handleStart);
bot.command('add', handleAddStart);
bot.command('list', handleList);
bot.command('search', handleSearchButton);

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

bot.on('message:text', async (ctx) => {
  const step = ctx.session.step;

  if ([AWAIT_TITLE, AWAIT_DISCRIPTION, AWAIT_TAGS].includes(step)) {
    return handleAddSteps(ctx);
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

  return ctx.reply('❗ Я не ожидал видео. Используй меню.');
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
