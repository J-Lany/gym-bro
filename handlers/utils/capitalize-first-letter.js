export function capitalizeFirstLetter(str) {
  if (!str || typeof str !== 'string') return str;

  const firstChar = str[0];
  const rest = str.slice(1);

  if (firstChar.match(/[a-zа-яё]/i)) {
    return firstChar.toUpperCase() + rest;
  }

  return str;
}
