import Image from "next/image";
import Link from "next/link";

interface ListTweetProps {
  photo: string;
  id: number;
  user: {
    username: string;
    avator?: string | null;
  };
}

export default function UserListTweet({ photo, id }: ListTweetProps) {
  return (
    <Link className="flex gap-5 items-center" href={`/tweet/${id}`}>
      <div className="relative size-28 overflow-hidden rounded-md">
        <Image
          className="object-cover"
          fill
          src={`${photo}/home`}
          alt={photo}
        />
      </div>
    </Link>
  );
}
