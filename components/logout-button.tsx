import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

export default function LogoutBtn() {
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <form action={logOut}>
      <button className="bg-neutral-200 px-5 py-3 rounded-3xl text-lg text-neutral-700 hover:bg-neutral-300 transition">
        로그아웃
      </button>
    </form>
  );
}
