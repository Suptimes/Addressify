import { useNavigate, useParams } from "react-router-dom"
import PostForm from "../../../components/forms/PostForm"
import { useGetPostById } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

const EditPost = () => {
    const { id } = useParams<{ id: string }>()
    const { data: post, isPending, isError } = useGetPostById(id || "")
    const navigate = useNavigate()
    const { user } = useUserContext();
    
    useEffect(() => {
      if (post && user) {
          if (post.userId !== user.id) {
              navigate('/unauthorized')
          }
      }
    }, [post, user, navigate]);

    if (isError || !post) return <h2 className="flex justify-center items-center">Post not found</h2>;

    if(isPending) return <Loader h={40} w={40} />

  return (
    <div className="absolute flex flex-1 md:left-[270px] top-[60px] left-0 xs:w-[100vw] md:min-w-[500px] md:w-[calc(100vw-270px)]">
      <div className="common-container-noscroll">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
            src="/icons/add-post.svg" 
            width={36}
            height={36} 
            alt="add" 
            className="brightness-0"/>
          <h2 className="h3-bold lg:h2-bold text-left w-full">Edit Property</h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  )
}

export default EditPost
