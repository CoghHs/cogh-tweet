"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic, startTransition } from "react";
import { dislikePost, likePost } from "@/app/(tabs)/tweet/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  tweetId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    startTransition(() => {
      reducerFn(null);
    });
    try {
      if (state.isLiked) {
        await dislikePost(tweetId); // 서버 액션 직접 호출
      } else {
        await likePost(tweetId); // 서버 액션 직접 호출
      }
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors ${
        state.isLiked
          ? "bg-sky-500 text-white border-sky-500"
          : "hover:bg-neutral-300"
      }`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      <span>
        {state.isLiked ? state.likeCount : `공감하기 (${state.likeCount})`}
      </span>
    </button>
  );
}
