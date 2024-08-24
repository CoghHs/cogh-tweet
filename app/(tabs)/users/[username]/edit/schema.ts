import { z } from "zod";

// 사용자 프로필을 위한 스키마
export const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional(),
  avatar: z.instanceof(File).optional(),
});

// 파일 업로드에 대한 스키마 (이미지 파일만 허용)
export const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "Only image files are allowed.",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "File size must be less than 2MB.",
  }),
});
