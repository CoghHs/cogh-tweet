"use client";

import FormButton from "@/components/button";
import FormInput from "@/components/input";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Link from "next/link";

export default function LogIn() {
  const [state, dispatch] = useFormState(login, null);
  return (
    <div className="flex flex-col gap-4 py-8 px-6 max-w-screen-sm h-1/2 mx-auto p-6 rounded-3xl shadow-2xl">
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="bg-black size-5 rounded-full mb-5" />
        <h1 className="text-2xl text-neutral-700 font-semibold">안녕하세요!</h1>
        <h2 className="text-lg text-neutral-500">
          Cogh에서 새로운 소식을 확인해보세요
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col w-1/2 mx-auto gap-6">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <FormButton text="로그인" />
      </form>
      <div className="mx-auto">
        <span className="text-neutral-600">또는</span>
      </div>
      <div className="flex gap-2 mx-auto pb-10">
        <span className="">아직 계정이 없나요?</span>
        <Link href="/create-account" className="hover:underline text-sky-400">
          회원가입
        </Link>
      </div>
    </div>
  );
}
