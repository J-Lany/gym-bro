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

export async function safeReplyText(ctx, text, keyboard) {
  if (ctx.callbackQuery?.message) {
    try {
      await ctx.editMessageText(text, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
      });
    } catch (err) {
      console.warn('⚠️ Не получилось отредактировать текст, fallback на reply');
      await ctx.reply(text, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }
}
