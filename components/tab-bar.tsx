"use client";

import {
  HomeIcon as SolidHomeIcon,
  NewspaperIcon as SolidNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidVideoIcon,
  UserIcon as SolidUserIcon,
  PlusIcon,
  MagnifyingGlassIcon as SolidSearchIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  NewspaperIcon as OutlineNewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineVideoIcon,
  UserIcon as OutlineUserIcon,
  MagnifyingGlassIcon as OutlineSearchIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar({ username }: { username: string }) {
  const pathname = usePathname();
  return (
    <div className="fixed left-0 top-0 w-full flex justify-between px-16 py-3 *:text-black bg-white ">
      <Link href="/tweets" className="flex flex-col items-center gap-px">
        {pathname === "/tweets" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>홈</span>
      </Link>
      <Link href="/tweets/add" className="flex flex-col items-center gap-px">
        {pathname === "/tweets/add" ? (
          <PlusIcon className="w-7 h-7" />
        ) : (
          <PlusIcon className="w-7 h-7" />
        )}
        <span>올리기</span>
      </Link>
      <Link href="/search">
        {pathname === "/search" ? (
          <SolidSearchIcon className="w-7 h-7" />
        ) : (
          <OutlineSearchIcon className="w-7 h-7" />
        )}
        <span>검색</span>
      </Link>
      <Link
        href={`/users/${username}`}
        className="flex flex-col items-center gap-px"
      >
        {pathname === `/users/${username}` ? (
          <SolidUserIcon className="w-7 h-7" />
        ) : (
          <OutlineUserIcon className="w-7 h-7" />
        )}
        <span>나의 당근</span>
      </Link>
    </div>
  );
}
