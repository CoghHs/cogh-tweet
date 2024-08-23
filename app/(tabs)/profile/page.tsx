import db from "@/lib/db";
import getSession from "@/lib/session";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="py-12">
      <h1>Welcome! {user?.username}</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
      <Link href="">Edit</Link>
    </div>
  );
}
