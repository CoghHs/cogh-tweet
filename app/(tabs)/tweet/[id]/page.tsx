import LikeButton from "@/components/like-button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getTweet(id: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return tweet;
}

const getCachedTweet = nextCache(getTweet, ["product-datail"], {
  tags: ["product-detail", "xxxx"],
});

async function getTweetTitle(id: number) {
  const tweet = await db.tweet.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return tweet;
}

const getCachedTweetTitle = nextCache(getTweetTitle, ["product-title"], {
  tags: ["product-title", "xxxx"],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedTweetTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

async function getTweets(id: number) {
  try {
    const tweets = await db.tweet.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return tweets;
  } catch (e) {
    return null;
  }
}

const getCachedTweets = nextCache(getTweets, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(tweetId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        tweetId,
        userId: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      tweetId,
    },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}

async function getCachedLikeStatus(tweetId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${tweetId}`],
  });
  return cachedOperation(tweetId, userId!);
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
  const tweet = await getCachedTweet(id);
  if (!tweet) {
    return notFound();
  }
  const tweets = await getCachedTweets(id);
  if (!tweets) {
    return notFound();
  }
  const { likeCount, isLiked } = await getCachedLikeStatus(id);
  const isOwner = await getIsOwner(tweet.userId);
  const onDelete = async () => {
    "use server";
    if (!isOwner) return;
    await db.tweet.delete({
      where: {
        id,
      },
      select: null,
    });
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
          {tweet.user.avatar !== null ? (
            <Image
              src={`${tweet.user.avatar}/avatar`}
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
        <span>조회 {tweets.views}</span>
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
    </div>
  );
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const tweets = await db.tweet.findMany({
    select: {
      id: true,
    },
  });
  return tweets.map((tweet) => ({ id: tweet.id + "" }));
}
