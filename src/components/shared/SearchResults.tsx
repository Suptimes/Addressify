import { Models } from "appwrite"
import PopularPostsList from "./PopularPostsList"
import Loader from "@/components/shared/Loader"

type SearchResultsProps = {
  isSearchFetching: boolean,
  searchedPosts: Models.Document[]
}

const SearchResults = ({ isSearchFetching, searchedPosts}: SearchResultsProps) => {
  if (isSearchFetching) {
    return <div className="flex-center m-auto">
            <Loader w={40} h={40} brightness="brightness-0" />
          </div>
      
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <PopularPostsList posts={searchedPosts.documents} />
  } else {
      return <p className="mt-10 text-center w-full">No results found</p>
  }
}

export default SearchResults
