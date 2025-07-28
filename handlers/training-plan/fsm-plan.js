import { safeReplyText } from '../utils/safe-replies.js';
import { selectTrainingCountKeyboard } from '../../keyboards/training-plan/select-training-count.js';
import exerciseOptionsKeyboard from '../../keyboards/training-plan/exercise-options.js';
import { parseStudents } from '../../utils/parse-students.js';
import {
  handleCommentInput,
  handleRepsInput,
  handleSetsInput,
} from './add-exercise-to-training.js';
import { handleCircuitFinalComment, handleCircuitReps } from './add-circuit.js';
import { handleFinishTraining } from './finish-training.js';
import { reviewTraining } from './review-training.js';
import { handleEditExercise } from './edit-exercise.js';
import isAdmin from '../admin/access-check.js';
import { handleSelectStudent } from './select-student.js';
import { deleteExercise } from './delete-exercise.js';
import { deleteTraining } from './delete-training.js';

export default async function fsmPlan(ctx) {
  if (!isAdmin(ctx)) {
    return ctx.reply('❌ Сори, но у тебя нет прав.');
  }

  if (!ctx.session.fsm) ctx.session.fsm = {};
  if (!ctx.session.fsm.data) ctx.session.fsm.data = {};

  const state = ctx.session.fsm.state;

  if (!state) return;

  switch (state) {
    case 'select_student': {
      return handleSelectStudent(ctx);
    }
    case 'review_training':
      return reviewTraining(ctx);
    case 'delete_training': {
      const index = ctx.session.fsm.deleteIndex;
      return deleteTraining(ctx, index);
    }
    case 'finish_training':
      return handleFinishTraining(ctx);
    case 'edit_exercise': {
      const training = ctx.session.currentTraining;
      const index = ctx.session.fsm.editIndex;
      return handleEditExercise(ctx, training, index);
    }
    case 'delete_exercise': {
      const index = ctx.session.fsm.deleteIndex;
      return deleteExercise(ctx, index);
    }
    case 'await_circuit_reps':
      return handleCircuitReps(ctx);
    case 'set_sets':
      return handleSetsInput(ctx);

    case 'set_reps':
      return handleRepsInput(ctx);

    case 'set_comment':
    case 'await_circuit_comment': {
      if (ctx.session.circuit) {
        return handleCircuitFinalComment(ctx);
      } else {
        return handleCommentInput(ctx);
      }
    }
  }
}
