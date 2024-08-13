import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: ListProductProps) {
  return (
    <Link className="flex gap-5 items-center" href={`/products/${id}`}>
      <div className="relative size-28 overflow-hidden rounded-md">
        <Image className="object-cover" fill src={photo} alt={title} />
      </div>
      <div className="flex flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="font-semibold text-lg">{formatToWon(price)}원</span>
      </div>
    </Link>
  );
}
