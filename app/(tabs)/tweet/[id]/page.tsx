import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import LikeButton from "@/components/like-button";

async function getIsOwner(userId: number) {
  const session = await getSession();
  return session?.id === userId;
}

async function getTweet(id: number) {
  try {
    const tweet = await db.tweet.findUnique({
      where: { id },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        description: true,
        title: true,
        photo: true,
        likes: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    return tweet;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getLikeStatus(tweetId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: { id: { tweetId, userId } },
  });
  const likeCount = await db.like.count({ where: { tweetId } });
  return { likeCount, isLiked: Boolean(isLiked) };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

async function getTweetTitle(id: number) {
  const tweet = await db.tweet.findUnique({
    where: { id },
    select: { title: true },
  });
  return tweet;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tweet = await getTweetTitle(Number(params.id));
  return {
    title: tweet?.title,
  };
}

export default async function TweetDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const tweet = await getTweet(id);
  if (!tweet) {
    return notFound();
  }

  const isOwner = await getIsOwner(tweet.user.id);
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const onDelete = async () => {
    "use server";
    if (!isOwner) return;
    await db.tweet.delete({ where: { id } });
    redirect("/tweets");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-10 gap-5">
      <div className="flex-1 relative">
        <Image
          className="rounded-lg object-cover"
          fill
          src={`${tweet.photo}/homenav`}
          alt={tweet.title}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-5 border-b border-neutral-500 pb-3">
          <div className="w-12 h-12 overflow-hidden rounded-full">
            {tweet.user.avatar ? (
              <Image
                src={`${tweet.user.avatar}/bigavatar`}
                width={48}
                height={48}
                alt={tweet.user.username}
              />
            ) : (
              <UserIcon className="w-12 h-12 text-gray-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{tweet.user.username}</h3>
          </div>
        </div>
        <div className="mb-5">
          <h1 className="text-3xl font-semibold mb-2">{tweet.title}</h1>
          <p className="text-gray-700 mb-2">{tweet.description}</p>
        </div>
        <div className="flex justify-between items-center">
          {isOwner && (
            <form action={onDelete}>
              <button className="bg-red-500 text-white rounded-md font-semibold px-5 py-2.5">
                Delete tweet
              </button>
            </form>
          )}
          <LikeButton isLiked={isLiked} likeCount={likeCount} tweetId={id} />
        </div>
      </div>
    </div>
  );
}
