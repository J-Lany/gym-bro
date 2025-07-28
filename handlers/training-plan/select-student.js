import { parseStudents } from '../../utils/parse-students.js';
import { safeReplyText } from '../utils/safe-replies.js';
import { selectTrainingCountKeyboard } from '../../keyboards/training-plan/select-training-count.js';

export function handleSelectStudent(ctx) {
  const data = ctx.session.fsm.data;
  const text = ctx.message?.text;

  const students = parseStudents();
  const selected = students.find(([name]) => name === text);

  if (!selected) {
    return ctx.reply('❗ Такого ученика нет. Выберите из списка.');
  }

  const [name, id] = selected;
  data.chatName = name;
  data.chatId = id;

  ctx.session.fsm.state = 'select_training_count';
  return safeReplyText(
    ctx,
    'Сколько тренировок в неделю?',
    selectTrainingCountKeyboard()
  );
}
