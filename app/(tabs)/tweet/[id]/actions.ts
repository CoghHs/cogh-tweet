// app/(tabs)/tweet/[id]/actions.ts

"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(tweetId: number) {
  try {
    const session = await getSession();
    if (!session?.id) throw new Error("Unauthorized");

    await db.like.create({
      data: {
        tweetId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function dislikePost(tweetId: number) {
  try {
    const session = await getSession();
    if (!session?.id) throw new Error("Unauthorized");

    await db.like.delete({
      where: {
        id: {
          tweetId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${tweetId}`);
  } catch (e) {
    console.error(e);
  }
}
