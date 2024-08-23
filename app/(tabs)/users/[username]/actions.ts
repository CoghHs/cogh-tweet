import db from "@/lib/db";

export async function getUser(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    include: {
      tweet: {
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          views: true,
          photo: true,
          description: true,
        },
      },
    },
  });
  if (user) {
    return user;
  }
}
