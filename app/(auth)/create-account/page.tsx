"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import Link from "next/link";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-4 py-8 px-6 max-w-screen-sm h-1/2 mx-auto p-6 rounded-3xl shadow-2xl">
      <div className="flex flex-col gap-2 justify-center items-center">
        <div className="bg-black size-5 rounded-full mb-5" />
        <h1 className="text-2xl text-neutral-700 font-semibold">안녕하세요!</h1>
        <h2 className="text-lg text-neutral-500">
          Cogh에 오신 것을 환영합니다
        </h2>
      </div>
      <form
        action={dispatch}
        className="flex flex-col w-1/2  justify-center mx-auto gap-6"
      >
        <Input
          name="username"
          type="text"
          placeholder="Username"
          required
          errors={state?.fieldErrors.username}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.confirm_password}
        />
        <Button text="회원가입" />
      </form>
      <div className="mx-auto">
        <span className="text-neutral-600">또는</span>
      </div>
      <div className="flex gap-2 mx-auto pb-10">
        <span className="">이미 계정이 있나요?</span>
        <Link href="/login" className="hover:underline text-sky-400">
          로그인
        </Link>
      </div>
    </div>
  );
}
