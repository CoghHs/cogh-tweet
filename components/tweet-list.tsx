"use client";

import { useEffect, useRef, useState } from "react";

import ListTweet from "./list-tweet";
import { InitialTweets } from "@/app/(tabs)/tweets/page";
import { getMoreTweets } from "@/app/(tabs)/tweets/actions";
import Masonry from "react-masonry-css";

interface TweetListProps {
  initialTweets: InitialTweets;
}

const breakpoints = {
  default: 5,
  1100: 4,
  700: 3,
  500: 2,
  300: 1,
};

export default function TweetList({ initialTweets }: TweetListProps) {
  const [tweets, setTweets] = useState(initialTweets);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreTweets(page + 1);
          if (newProducts.length !== 0) {
            setTweets((prev) => [...prev, ...newProducts]);
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }

          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5">
      <Masonry
        breakpointCols={breakpoints}
        className="flex space-x-2 overflow-hidden"
        columnClassName="masonry-column"
      >
        {tweets.map((tweet) => (
          <ListTweet key={tweet.id} {...tweet} />
        ))}
      </Masonry>
    </div>
  );
}
