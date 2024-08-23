"use server";

import db from "@/lib/db";

export async function getMoreTweets(page: number) {
  const tweet = await db.tweet.findMany({
    select: {
      title: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 1,
    orderBy: {
      created_at: "asc",
    },
  });
  return tweet;
}
