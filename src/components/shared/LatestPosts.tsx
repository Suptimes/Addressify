import { Models } from 'appwrite'
import Loader from '@/components/shared/Loader.tsx'
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations.tsx"
import Card from "@/components/card/Card.tsx"


const LatestPosts = () => {
    
    const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPosts()
  
  return (
    <div className="flex flex-1 w-full">
      <div className='common-container-noscroll'>
        <div className='home-posts'>
          <h2 className='h3-bold lg:h2-bold text-left w-full'>Latest Properties</h2>
          {isPostLoading && !posts ? (
            <div className='brightness-50'>
              <Loader h={40} w={40} />
            </div>
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts?.documents.map((post: Models.Document) => (
                <li className='list-none' key={post.$id}>
                  <Card item={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}


export default LatestPosts
