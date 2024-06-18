import "./createPost.scss"
import PostForm from "../../../components/forms/PostForm"

const CreatePost = () => {
  return (
    <div className="middlepage flex flex-1 md:left-[270px]">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="../../../../../public/icons/add-post.svg" width={36}
          height={36} alt="add" className="brightness-0 " />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Property</h2>
        </div>

        <PostForm />
      </div>
    </div>
  )
}

export default CreatePost
