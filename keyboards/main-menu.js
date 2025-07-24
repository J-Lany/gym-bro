import { InlineKeyboard } from 'grammy';

export default new InlineKeyboard()
  .text('🔍 Поиск упражнения', 'menu:search')
  .row()
  .text('📋 Список', 'menu:list')
  .text('➕ Добавить', 'menu:add')
  .row();
