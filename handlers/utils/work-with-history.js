export function pushToHistory(ctx, pageId) {
  if (!ctx.session.history) ctx.session.history = [];
  const history = ctx.session.history;

  if (history.length === 0 || history[history.length - 1] !== pageId) {
    history.push(pageId);
  }
}

export function popFromHistory(ctx) {
  if (!ctx.session.history) return null;
  return ctx.session.history.pop();
}

export function clearHistory(ctx) {
  ctx.session.history = [];
}
