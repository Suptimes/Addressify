import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"


const Saved = () => {
  
  const { data: currentUser } = useGetCurrentUser()
  console.log(currentUser)
  // const savedPosts = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id)
  
  return (
    <div className="absolute md:left-[270px] top-[60px] left-0">
      saved
    </div>
  )
}

export default Saved
