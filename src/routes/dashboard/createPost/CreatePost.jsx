import "./createPost.scss"
import PostForm from "../../../components/forms/PostForm"

const CreatePost = () => {
  return (
    <div className="middlePage">
      <div className="common-container-noscroll">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
            src="/icons/add-post.svg" 
            width={36}
            height={36} 
            alt="add" 
            className="brightness-0"/>
          <h2 className="h3-bold lg:h2-bold text-left w-full">Create Property</h2>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  )
}

export default CreatePost
