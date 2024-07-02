import Card2 from "@/components/cardNoEdit/Card2"
import Loader from "@/components/shared/Loader"
import PropertyCard from "@/components/shared/PropertyCard"
import { useGetCurrentUser, useGetSaveById, useGetSavedPosts } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { useEffect, useState } from "react"



const Saved = () => {
  const { data: currentUser, isLoading: isUserLoading } = useGetCurrentUser();
  console.log("savesss:", currentUser?.save)
  const savedPostIds = currentUser?.save.map((save: any) => save.$id);
  console.log("saved posts iddd", savedPostIds)
  const { data: savedPosts, isLoading: isSavedPostsLoading } = useGetSavedPosts(savedPostIds);
  
  const [savedUserPosts, setSavedUserPosts] = useState<Models.Document[]>([]);
  
  useEffect(() => {
    if (savedPosts) {
      const savedPostsObj = savedPosts.map((obj)=>obj.post).reverse()
      setSavedUserPosts(savedPostsObj);
    }
  }, [savedPosts]);


  console.log("RESULTS: ", savedUserPosts)

  return (
    <div className="middlePage">
      <div className="common-container-noscroll w-full max-w-5xl">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img 
              src="/icons/save.svg" 
              width={36}
              height={36} 
              alt="add" 
              className="brightness-0"/>
            <h2 className="h3-bold lg:h2-bold text-left w-full">Saved Properties</h2>
        </div>


        {isUserLoading || isSavedPostsLoading ? 
            <div className="flex w-full h-full my-10 justify-center">
              <Loader w={40} h={40} brightness="brightness-50"/>
            </div> :
        !isUserLoading && !isSavedPostsLoading && savedUserPosts.length > 0 ? (
            <div className="flex flex-col flex-1 w-full">
              {savedUserPosts.map((post: Models.Document) => (
                <li className='list-none' key={post.$id}>
                  <PropertyCard post={post} />
                </li>))}
            </div>
          ) : (
            <p className="mt-10 text-[20px] text-center w-full">
              No saved properties yet.
            </p>)} 
      </div>
    </div>
  )
}

export default Saved

// useEffect(() => {
  //   if (!isUserLoading && currentUser && Array.isArray(currentUser?.save)) {
  //     const savedPosts = currentUser.save.map((saveEntry: SavedEntry) => saveEntry.post).reverse();
  //     setSavedUserPosts(savedPosts);
  //     // console.log("posts: ", savedPosts);
  //   }
  // }, [isUserLoading, currentUser]);