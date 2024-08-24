"use client";

import {
  HomeIcon as SolidHomeIcon,
  UserIcon as SolidUserIcon,
  PlusIcon,
  MagnifyingGlassIcon as SolidSearchIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  UserIcon as OutlineUserIcon,
  MagnifyingGlassIcon as OutlineSearchIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TabBar({ username }: { username: string }) {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword) {
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  useEffect(() => {
    setKeyword("");
  }, [pathname]);

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
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색"
          className="px-4 py-2 border border-neutral-300 rounded-lg"
        />
        <button type="submit" className="ml-2">
          {pathname === "/search" ? (
            <SolidSearchIcon className="w-7 h-7" />
          ) : (
            <OutlineSearchIcon className="w-7 h-7" />
          )}
        </button>
      </form>
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
