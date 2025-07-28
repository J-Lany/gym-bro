import { Keyboard } from 'grammy';
import { parseStudents } from '../../utils/parse-students.js';

export function selectStudentKeyboard() {
  const students = parseStudents();
  const kb = new Keyboard();
  students.forEach(([name]) => kb.text(name).row());
  return kb;
}
