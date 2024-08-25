import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center max-w-screen-sm h-1/2 mx-auto p-10 rounded-3xl shadow-2xl">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <div className="bg-black size-5 rounded-full mb-5" />
        <h1 className="font-serif mt-10 text-6xl">COGH</h1>
        <h2 className="text-3xl text-neutral-700 mt-10 font-semibold">
          Cogh에 오신 것을 환영합니다
        </h2>
        <h2 className="text-lg text-neutral-500 mt-6">
          Cogh에서 새로운 소식을 확인해보세요
        </h2>
      </div>
      <div className="flex flex-col mt-10 items-center gap-6 w-1/2 pb-20">
        <Link href="/create-account" className="primary-btn text-lg py-2.5">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline text-sky-400">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
