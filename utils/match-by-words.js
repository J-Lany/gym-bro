import stringSimilarity from 'string-similarity';

export function matchByWords(query, exercises, threshold = 0.8) {
  const result = [];
  const normalizedQuery = query.trim().toLowerCase();
  for (const ex of exercises) {
    const words = ex.title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(' ');

    for (const word of words) {
      const similarity = stringSimilarity.compareTwoStrings(
        normalizedQuery,
        word
      );

      if (similarity >= threshold) {
        result.push(ex);
        break;
      }
    }
  }

  return result;
}
