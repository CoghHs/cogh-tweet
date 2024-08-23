"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadTweet } from "./actions";
import { z } from "zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tweetSchema, TweetType } from "./schema";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "이미지 파일은 2MB 이하로 업로드 가능합니다.",
  }),
});

export default function AddTweet() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TweetType>({
    resolver: zodResolver(tweetSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files || files.length == 0) {
      setPreview("");
      return;
    }
    const file = files[0];
    const results = fileSchema.safeParse(file);
    if (!results.success) {
      alert(
        results.error.flatten().fieldErrors.type ||
          results.error.flatten().fieldErrors.size
      );
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/2D7iuynfofPUs7N3pYD8rA/${id}`
      );
    }
  };
  const onSubmit = handleSubmit(async (data: TweetType) => {
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("photo", data.photo);
    return uploadTweet(formData);
  });
  const onValid = async () => {
    await onSubmit();
  };

  return (
    <div>
      <form action={onValid} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex justify-center items-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept="image/*"
        />
        <Input
          {...register("title")}
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          {...register("description")}
          required
          placeholder="자세한 설명"
          type="text"
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
