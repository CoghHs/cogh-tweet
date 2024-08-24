import TweetList from "@/components/tweet-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

const getCachedProducts = nextCache(getInitialTweets, ["home-products"]);

async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
    select: {
      title: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1, caching 예제를 위한 비활성화
    orderBy: {
      created_at: "asc",
    },
  });
  return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export const metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

// export const revalidate = 60;

export default async function Tweets() {
  const initialTweets = await getInitialTweets();
  const revalidate = async () => {
    "use server";
    revalidatePath("/tweets");
  };
  return (
    <div>
      <TweetList initialTweets={initialTweets} />
      {/* <form action={revalidate}>
        <button>Revalidate</button>
      </form> */}
    </div>
  );
}
