import stringSimilarity from 'string-similarity';

export default function matchByFuzzyTitle(query, exercises, minRating = 0.6) {
  const normalizedQuery = query.trim().toLowerCase();
  const titles = exercises.map((e) => e.title.toLowerCase());
  const matches = stringSimilarity.findBestMatch(normalizedQuery, titles);
  return matches.ratings
    .filter((r) => r.rating >= minRating)
    .sort((a, b) => b.rating - a.rating)
    .map((r) => {
      return exercises.find((e) => e.title.toLowerCase() === r.target);
    })
    .filter(Boolean);
}
