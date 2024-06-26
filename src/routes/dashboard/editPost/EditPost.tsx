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
    const { user, isLoading } = useUserContext();
    
    useEffect(() => {
      if (!isPending && !isLoading && post && user) {
          if (post.owner.$id !== user.id) {
              console.warn(`Unauthorized access attempt. Post userId: ${post.owner.$id}, current userId: ${user.id}`)
              navigate('/unauthorized')
          }
      }
    }, [post, user, isPending, isLoading, navigate]);


    if (isError || !post) return <h2 className="flex justify-center items-center">Post not found</h2>;

    

  return (
    <div className="middlePage">
      <div className="common-container-noscroll">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
            src="/icons/edit-property.svg"
            width={36}
            height={36} 
            alt="edit-property" 
            className="brightness-0"/>
          <h2 className="h3-bold lg:h2-bold text-left w-full">Edit Property</h2>
        </div>
        {isPending || isLoading 
          ? (<div className="brightness-50"><Loader h={40} w={40} /></div>) 
          : (<PostForm action="Update" post={post} />)
        }
      </div>
    </div>
  )
}

export default EditPost
