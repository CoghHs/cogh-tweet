"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import bcrypt from "bcrypt";
import { profileSchema, fileSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    bio: formData.get("bio"),
    password: formData.get("password"),
    avatar: formData.get("avatar"),
  };

  const result = profileSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }

  const session = await getSession();
  if (session.id) {
    const updateData: any = {
      username: result.data.username,
      email: result.data.email,
      bio: result.data.bio,
    };

    if (result.data.password) {
      const hashedPassword = await hashPassword(result.data.password);
      updateData.password = hashedPassword;
    }

    if (result.data.avatar instanceof File) {
      const fileValidation = fileSchema.safeParse({
        type: result.data.avatar.type,
        size: result.data.avatar.size,
      });

      if (!fileValidation.success) {
        return fileValidation.error.flatten();
      }

      const uploadUrlResponse = await getUploadUrl();
      const uploadUrl = uploadUrlResponse.result.uploadURL;

      const cloudflareForm = new FormData();
      cloudflareForm.append("file", result.data.avatar);
      await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });

      const avatarUrl = `https://imagedelivery.net/2D7iuynfofPUs7N3pYD8rA/${uploadUrlResponse.result.id}`;
      updateData.avatar = avatarUrl;
    }

    const updatedUser = await db.user.update({
      where: { id: session.id },
      data: updateData,
      select: { username: true },
    });

    revalidatePath(`/users/${updatedUser.username}`);
    return redirect(`/users/${updatedUser.username}`);
  }
}

export async function getUserProfile(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  return user;
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
