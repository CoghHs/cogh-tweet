import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListTweetProps {
  title: string;
  created_at: Date;
  photo: string;
  id: number;
  user?: {
    username: string;
    avator?: string | null;
  };
}

export default function ListTweet({
  title,
  created_at,
  photo,
  id,
}: ListTweetProps) {
  return (
    <Link className="flex gap-5 items-center" href={`/tweet/${id}`}>
      <div className="relative size-28 overflow-hidden rounded-md">
        <Image
          className="object-cover"
          fill
          src={`${photo}/home`}
          alt={title}
        />
      </div>
      <div className="flex flex-col gap-1 *:text-black">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </Link>
  );
}
