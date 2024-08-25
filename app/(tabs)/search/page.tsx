import { notFound } from "next/navigation";
import { getSearchResults } from "./actions";
import SearchList from "@/components/search-list";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { keyword: string };
}) {
  const keyword = searchParams.keyword;
  if (!keyword) {
    notFound();
  }
  const results = await getSearchResults(keyword);
  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-medium mb-4">
        {keyword}로 검색한 결과입니다
      </h1>
      <div>
        <SearchList initialTweets={results} keyword={keyword} />
      </div>
    </div>
  );
}
