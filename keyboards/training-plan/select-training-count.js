import { InlineKeyboard } from 'grammy';

export function selectTrainingCountKeyboard() {
  const kb = new InlineKeyboard();
  for (let i = 1; i <= 5; i++) {
    kb.text(`${i}`, `fsm:training_count:${i}`);
  }
  return kb;
}
