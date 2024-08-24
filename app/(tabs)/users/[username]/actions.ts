import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getUser(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    include: {
      tweet: {
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          views: true,
          photo: true,
          description: true,
        },
      },
    },
  });
  if (user) {
    return user;
  }
}

const searchSchema = z.object({
  keyword: z.string({
    required_error: "error",
  }),
});

export async function searchKeyword(_: any, formData: FormData) {
  const data = {
    keyword: formData.get("keyword"),
  };
  const result = await searchSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const searchResult = encodeURI(result.data.keyword);
    revalidatePath(`/search?keyword=${searchResult}`);
    redirect(`/search?keyword=${searchResult}`);
  }
}
