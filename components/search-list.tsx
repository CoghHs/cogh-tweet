"use client";

import { useEffect, useState } from "react";
import ListTweet from "./list-tweet";
import { InitialTweets } from "@/app/(tabs)/tweets/page";

interface SearchListProps {
  initialTweets: InitialTweets;
  keyword: string;
}

export default function SearchList({
  initialTweets,
  keyword,
}: SearchListProps) {
  const [tweets, setTweets] = useState(initialTweets);
  useEffect(() => {
    if (keyword) {
      setTweets(initialTweets);
    }
  }, [keyword]);
  return (
    <div className="p-5 flex flex-col gap-5">
      {tweets.map((tweet) => (
        <ListTweet key={tweet.id} {...tweet} />
      ))}
    </div>
  );
}
