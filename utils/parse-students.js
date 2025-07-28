export function parseStudents() {
  const raw = process.env.CHATS || '';
  return raw
    .split(',')
    .map((entry) => entry.split(':'))
    .filter(([name, id]) => name && id);
}
