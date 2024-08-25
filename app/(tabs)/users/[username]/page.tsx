import Image from "next/image";
import { getUser } from "./actions";
import Link from "next/link";
import UserListTweet from "@/components/user-tweet-list";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import LogoutBtn from "@/components/logout-button";

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUser(params.username);
  return (
    <div className=" flex flex-col items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        {user?.avatar ? (
          <Image
            src={`${user?.avatar}/bigavatar`}
            alt="avatar"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="size-32 bg-neutral-200 rounded-full" />
        )}
        <span className="text-4xl font-medium">{user?.username}</span>
        <span className="text-neutral-400">{user?.email}</span>
        {user?.bio ? (
          <span className="text-neutral-500 text-lg">{user?.bio}</span>
        ) : (
          <span className="text-neutral-500 text-lg">
            자기소개를 추가해보세요 !
          </span>
        )}
        <div className="mt-3 flex gap-2">
          <Link
            className="bg-neutral-200 px-5 py-3 rounded-3xl text-lg text-neutral-700 hover:bg-neutral-300 transition"
            href={`/users/${user?.username}/edit`}
          >
            프로필 수정
          </Link>
          <LogoutBtn />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {user?.tweet?.map((tweet) => (
          <UserListTweet key={tweet.id} user={user} {...tweet} />
        ))}
      </div>
    </div>
  );
}
