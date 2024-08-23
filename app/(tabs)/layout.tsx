import TabBar from "@/components/tab-bar";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

async function getUsername() {
  const session = await getSession();
  if (!session.id) {
    notFound();
  } else {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        username: true,
      },
    });
    return user?.username;
  }
}

export default async function TabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const username = await getUsername();
  return (
    <div>
      {children}
      <TabBar username={username!} />
    </div>
  );
}
