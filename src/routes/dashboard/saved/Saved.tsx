import Card from "@/components/card/Card.tsx"
import Loader from "@/components/shared/Loader"
import PopularPostsList from "@/components/shared/PopularPostsList"
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import { useEffect, useState } from "react"


const Saved = () => {

  const [savedUserPosts, setSavedUserPosts] = useState<Models.Document[]>([]);
  const { data: currentUser, isLoading: isUserLoading } = useGetCurrentUser()

  // Fetch and set saved posts when currentUser is available
  useEffect(() => {
    if (!isUserLoading && currentUser && Array.isArray(currentUser.save)) {
      const savedPosts = currentUser?.save
      .map((savePost: Models.Document) => ({
        ...savePost.post,
        creator: {
          imageUrl: currentUser.imageUrl,
        },
      })).reverse();
      setSavedUserPosts(savedPosts);
    }
  }, [isUserLoading, currentUser]);
  

  return (
    <div className="absolute md:left-[270px] top-[60px] left-0">
      <div className="common-container-noscroll max-w-5xl">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img 
              src="/icons/save.svg" 
              width={36}
              height={36} 
              alt="add" 
              className="brightness-0"/>
            <h2 className="h3-bold lg:h2-bold text-left w-full">Saved Properties</h2>
        </div>
          {isUserLoading ? <div className="flex-center w-full h-full my-10 mx-auto">
              <Loader w={40} h={40} brightness="brightness-50"/>
            </div> :
          !isUserLoading && savedUserPosts.length > 0 ? (
            <div>
              {savedUserPosts.map((post: Models.Document) => (
                <li className='list-none' key={post.$id}>
                  <Card item={post} />
                </li>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center w-full">
              No saved properties
          </p>)}
      </div>
    </div>
  )
}

export default Saved
