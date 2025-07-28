import { selectStudentKeyboard } from '../../keyboards/training-plan/select-student.js';

export default async function createPlanStart(ctx) {
  ctx.session.fsm = {
    state: 'select_student',
    data: {},
  };

  await ctx.reply('Выбери кому делаем план:', {
    reply_markup: selectStudentKeyboard(),
  });
}
