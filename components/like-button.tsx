"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
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
  const [state, setState] = useState({ isLiked, likeCount });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      if (state.isLiked) {
        await dislikePost(tweetId);
        setState((prev) => ({
          isLiked: false,
          likeCount: prev.likeCount - 1,
        }));
      } else {
        await likePost(tweetId);
        setState((prev) => ({
          isLiked: true,
          likeCount: prev.likeCount + 1,
        }));
      }
    } catch (e) {
      setError("An error occurred while updating like status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2 transition-colors ${
        state.isLiked
          ? "bg-orange-500 text-white border-orange-500"
          : "hover:bg-neutral-800"
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
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </button>
  );
}
