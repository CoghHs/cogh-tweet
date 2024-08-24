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
      <h1 className="text-2xl font-bold mb-4">Search Results for {keyword}</h1>
      <div>
        <SearchList initialTweets={results} keyword={keyword} />
      </div>
    </div>
  );
}
