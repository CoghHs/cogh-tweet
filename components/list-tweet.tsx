import Image from "next/image";
import Link from "next/link";

interface ListTweetProps {
  title: string;
  photo: string;
  id: number;
  user?: {
    username: string;
    avator?: string | null;
  };
}

function getRandomHeight() {
  const heights = ["h-48", "h-64", "h-80", "h-96", "h-72"];
  return heights[Math.floor(Math.random() * heights.length)];
}

export default function ListTweet({ title, photo, id }: ListTweetProps) {
  const randomHeightClass = getRandomHeight();

  return (
    <Link
      href={`/tweet/${id}`}
      className={`block overflow-hidden rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out ${randomHeightClass} mb-6`}
    >
      <div className="relative w-full h-full group">
        <Image
          className="object-cover w-full h-full group-hover:opacity-80 transition-opacity duration-300"
          src={`${photo}/home`}
          alt={title}
          layout="fill"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{title}</span>
        </div>
      </div>
    </Link>
  );
}
