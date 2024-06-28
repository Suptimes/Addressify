import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import SearchResults from "./SearchResults"
import PopularPostsList from "./PopularPostsList"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations"
import useDebounce from "@/hooks/useDebounce"
import Loader from "@/components/shared/Loader"
import { useInView } from "react-intersection-observer"

const ExplorePages = () => {
    const {ref, inView } = useInView()
    const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

    const [ searchValue, setSearchValue ] = useState("")
    const debouncedValue = useDebounce(searchValue, 500)
    const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue)

    useEffect(() => {
        if(inView && !searchValue) fetchNextPage()
    }, [inView, searchValue, fetchNextPage])

    if(!posts) {
        return (
            <div className="flex-center w-full h-full mt-10">
                <Loader w={40} h={40} brightness="brightness-50" />
            </div>
        )
    }

    console.log("Postss:", posts)

    const shouldShowSearchResults = searchValue !== "" && debouncedValue === searchValue
    const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item?.documents.length === 0)
    
  return (
    <div className="flex flex-col w-full">
        <div className="common-container-noscroll max-w-5xl">
            <div className="flex justify-center items-center bg-gray-50 hover:bg-gray-100 h-12 rounded-lg gap-3 px-5 w-full focus-within:ring-2 ring-violet-800">
                <img src="/icons/search.svg" alt="search" width={24} height={24} />
                <Input
                    type="text"
                    placeholder="Search"
                    className="flex items-center bg-transparent text-[16px] shad-input-2"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>

            <div className="flex-between w-full max-w-5xl">
                <h2 className="h3-bold lg:h2-bold text-left w-full">Search Properties</h2>
                <div className="flex-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium">All</p>
                    <img src="/icons/filter.svg" className="brightness-0" alt="filter" width={20} height={20} />
                </div>
            </div>

            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {shouldShowSearchResults ? (
                    <SearchResults 
                        isSearchFetching={isSearchFetching}
                        searchedPosts={searchedPosts}
                    />
                ) : shouldShowPosts ? (
                    <p className="mt-10 text-center w-full">End of properties.</p>

                ) : posts?.pages.map((item, index) => (
                    <PopularPostsList key={`page-${index}`} posts={item.documents} />
                ))
                }
            </div>

        </div>

        {hasNextPage && !searchValue && (
            <div ref={ref} className="flex-center w-full h-full my-10 mx-auto">
                <Loader w={30} h={30} brightness="brightness-50" />
            </div>
        )}
    </div>
  )
}

export default ExplorePages
