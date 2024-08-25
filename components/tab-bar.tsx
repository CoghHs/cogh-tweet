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
    <div className="fixed left-0 top-0 w-full flex items-center justify-between px-10 py-6 bg-white *:text-black">
      <div className="flex items-center gap-10">
        <Link href="/tweets" className="flex flex-col items-center gap-px">
          <h1 className="font-serif  text-2xl">COGH</h1>
        </Link>
        <Link href="/tweets" className="flex flex-col items-center gap-px">
          {pathname === "/tweets" ? (
            <span className="px-5 py-2.5 bg-black text-white rounded-3xl">
              홈
            </span>
          ) : (
            <span className="px-5 py-2.5 rounded-3xl">홈</span>
          )}
        </Link>
        <Link href="/tweets/add" className="flex flex-col items-center gap-px">
          {pathname === "/tweets/add" ? (
            <span className="px-5 py-2.5 bg-black text-white rounded-3xl">
              올리기
            </span>
          ) : (
            <span className="px-5 py-2.5 rounded-3xl">올리기</span>
          )}
        </Link>
      </div>
      <form onSubmit={handleSearch} className="flex items-center w-[73%]">
        <input
          type="text"
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색"
          className="w-full px-4 py-2.5 border border-neutral-300 bg-gray-100 rounded-3xl  focus:outline-none focus:ring-1 focus:ring-sky-300"
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
          <SolidUserIcon className="w-7 h-7 " />
        ) : (
          <OutlineUserIcon className="w-7 h-7" />
        )}
      </Link>
    </div>
  );
}
