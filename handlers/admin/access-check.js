export default function isAdmin(ctx) {
  const admins = process.env.ADMINS.split(',').map((id) => id.trim());
  console.log(ctx.from);
  return admins.includes(String(ctx.from.id));
}
