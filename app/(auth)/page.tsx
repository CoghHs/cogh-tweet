import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center max-w-screen-sm h-1/2 mx-auto p-3 rounded-3xl shadow-2xl">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <Image
          src="/coghprofile.jpg"
          alt="Cogh Profile"
          width={500}
          height={500}
          className="w-80 h-80"
        />
        <h2 className="text-3xl text-neutral-700 font-semibold">
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
