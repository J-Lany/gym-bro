import { InlineKeyboard } from 'grammy';
import Exercise from '../../models/Exercise.js';
import { safeReplyText } from '../utils/safe-replies.js';
import exOptKb from '../../keyboards/training-plan/exercise-options.js';

export async function handleStartCircuit(ctx) {
  ctx.session.circuit = {
    rounds: null,
    exercises: [],
  };
  ctx.session.fsm.state = 'await_circuit_rounds';

  const kb = new InlineKeyboard()
    .text('1', 'circuit:rounds:1')
    .text('2', 'circuit:rounds:2')
    .text('3', 'circuit:rounds:3')
    .text('4', 'circuit:rounds:4')
    .text('5', 'circuit:rounds:5');

  await ctx.reply('🔁 Сколько кругов в круговой?', { reply_markup: kb });
}

export async function handleCircuitRounds(ctx) {
  const rounds = ctx.match[1];
  ctx.session.circuit.rounds = rounds;
  ctx.session.fsm.state = 'await_circuit_category';

  const tags = await Exercise.distinct('tags');
  const kb = new InlineKeyboard();
  tags.forEach((tag) => kb.text(tag, `circuit:category:${tag}`).row());

  await safeReplyText(ctx, '📂 Выбери категорию упражнения:', kb);
}

export async function handleCircuitCategory(ctx) {
  const tag = ctx.match[1];
  ctx.session.currentCategory = tag;
  ctx.session.fsm.state = 'await_circuit_exercise';

  const exercises = await Exercise.find({ tags: tag }).limit(10);
  const kb = new InlineKeyboard();
  exercises.forEach((ex) => kb.text(ex.title, `circuit:ex:${ex._id}`).row());

  await safeReplyText(ctx, '🏋🏽 Выбери упражнение:', kb);
}

export async function handleCircuitExercise(ctx) {
  const exId = ctx.match[1];
  const exercise = await Exercise.findById(exId);
  ctx.session.tempExercise = { title: exercise.title };
  ctx.session.fsm.state = 'await_circuit_reps';

  await ctx.reply('🔁 Введи количество повторений:');
}

export async function handleCircuitReps(ctx) {
  const reps = ctx.message.text.trim();
  const temp = ctx.session.tempExercise;
  ctx.session.circuit.exercises.push({ ...temp, reps });
  ctx.session.tempExercise = null;
  ctx.session.fsm.state = 'await_circuit_next';

  const kb = new InlineKeyboard()
    .text('➕ Добавить ещё', 'circuit:add')
    .text('🛑 Завершить круговую', 'circuit:done');

  await ctx.reply('Что делаем дальше?', { reply_markup: kb });
}

export async function handleCircuitDone(ctx) {
  ctx.session.fsm.state = 'await_circuit_comment';
  await ctx.reply('🗒 Добавь комментарий к круговой (или "-" если без):');
}

export async function handleCircuitFinalComment(ctx) {
  if (!ctx.session.currentTraining) {
    ctx.session.currentTraining = { exercises: [] };
  }

  ctx.session.currentTraining.exercises.push({
    type: 'circuit',
    rounds: ctx.session.circuit.rounds,
    items: ctx.session.circuit.exercises,
    comment: ctx.message.text.trim(),
  });

  ctx.session.circuit = null;
  ctx.session.fsm.state = 'add_exercise';

  await ctx.reply('✅ Круговая добавлена!', { reply_markup: exOptKb });
}
