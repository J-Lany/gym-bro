export async function safeReplyVideo(ctx, videoFileId, caption, keyboard) {
  if (ctx.callbackQuery?.message) {
    try {
      await ctx.editMessageMedia(
        {
          type: 'video',
          media: videoFileId,
          caption,
          parse_mode: 'HTML',
        },
        {
          reply_markup: keyboard,
        }
      );
    } catch (err) {
      console.warn('⚠️ Не получилось отредактировать видео, fallback на reply');
      await ctx.replyWithVideo(videoFileId, {
        caption,
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    }
  } else {
    await ctx.replyWithVideo(videoFileId, {
      caption,
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }
}

export async function safeReplyText(ctx, text, keyboard = undefined) {
  const replyOptions = {
    parse_mode: 'HTML',
    ...(keyboard ? { reply_markup: keyboard } : {}),
  };

  if (ctx.callbackQuery?.message) {
    try {
      await ctx.editMessageText(text, replyOptions);
    } catch (err) {
      console.warn('⚠️ Не получилось отредактировать текст, fallback на reply');
      await ctx.reply(text, replyOptions);
    }
  } else {
    await ctx.reply(text, replyOptions);
  }
}
