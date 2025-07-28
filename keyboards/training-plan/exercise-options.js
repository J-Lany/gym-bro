import { InlineKeyboard } from 'grammy';

const exerciseOptionsKeyboard = new InlineKeyboard()
  .text('➕ Добавить упражнение', 'fsm:add_exercise')
  .row()
  .text('🔁 Добавить круговую', 'fsm:add_circuit')
  .row()
  .text('✅ Завершить тренировку', 'fsm:review_training');

export default exerciseOptionsKeyboard;
