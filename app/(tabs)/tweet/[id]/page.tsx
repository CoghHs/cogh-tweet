import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  return session?.id === userId;
}

async function getTweet(id: number) {
  try {
    const tweet = await db.tweet.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        description: true,
        title: true,
        photo: true,
        views: true,
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
  } catch (e) {}
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
    <div className="flex flex-col">
      <div className="relative aspect-square">
        <Image
          className="object-cover"
          fill
          src={`${tweet.photo}/public`}
          alt={tweet.title}
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full ">
          {tweet.user.avatar ? (
            <Image
              src={`${tweet.user.avatar}/bigavatar`}
              width={40}
              height={40}
              alt={tweet.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{tweet.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{tweet.title}</h1>
        <p>{tweet.description}</p>
        <p>조회수 {tweet.views}</p>
      </div>
      <div className=" p-5 pb-10 flex justify-between items-center">
        {isOwner ? (
          <div className="flex gap-2">
            <form action={onDelete}>
              <button className="bg-red-500 rounded-md text-white font-semibold px-5 py-2.5">
                Delete tweet
              </button>
            </form>
          </div>
        ) : null}
      </div>
      <LikeButton isLiked={isLiked} likeCount={likeCount} tweetId={id} />
    </div>
  );
}
