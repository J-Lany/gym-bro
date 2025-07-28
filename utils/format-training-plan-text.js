import { pluralize } from './pluralize.js';

export function formatTrainingPlanText(trainings) {
  let message = 'Привет! Твой тренировочный план на неделю:\n\n';

  trainings.forEach((training, index) => {
    message += `<b>📋 Тренировка №${index + 1}</b>\n🏋🏾‍♀️ Кадрдио 🏋🏾‍♀️\nСуставная\n🏋🏾‍♀️ Растяжка\n\n`;

    for (const exercise of training.exercises) {
      if (exercise.type === 'regular') {
        const setsLabel = pluralize(exercise.sets, [
          'подход',
          'подхода',
          'подходов',
        ]);
        const repsLabel = pluralize(exercise.reps, [
          'повторение',
          'повторения',
          'повторений',
        ]);

        message += `🏋🏻‍♀️ ${exercise.title} — ${exercise.sets} ${setsLabel} по ${exercise.reps} ${repsLabel}\n`;
        message += exercise.comment ? `💬 ${exercise.comment}\n` : '';
      }

      if (exercise.type === 'circuit') {
        const roundsLabel = pluralize(exercise.rounds, [
          'круг',
          'круга',
          'кругов',
        ]);
        message += `🏋🏻‍♀️ <b>Круговая</b>. ${exercise.rounds} ${roundsLabel}\n`;

        for (const item of exercise.items) {
          const repsLabel = pluralize(item.reps, [
            'повторение',
            'повторения',
            'повторений',
          ]);
          message += `   • ${item.title} - ${item.reps} ${repsLabel}\n`;
        }

        message += exercise.comment ? `💬 ${exercise.comment}\n` : '';
      }

      message += '\n';
    }

    message += '\n';
  });

  return message.trim();
}
