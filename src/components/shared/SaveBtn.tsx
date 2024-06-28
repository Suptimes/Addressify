import { useDeleteSavedPost, useGetCurrentUser, useSavePost } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite"
import React, { useEffect, useState } from "react"

type PostStatsProps = {
  post: Models.Document
  userId: string
}

const SaveBtn = ({ post, userId }: PostStatsProps) => {
  const [isSaved, setIsSaved] = useState(false)
  
  const { mutate: savePost } = useSavePost()
  const { mutate: deleteSavedPost } = useDeleteSavedPost()
  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUser()

  // Check if the post is saved
  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id)

  // Update `isSaved` state when `savedPostRecord` changes
  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [savedPostRecord])

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id, {
        onSuccess: () => {
          // Refresh user data after unsaving
          refetchCurrentUser()
        },
        onError: () => {
          // Revert the state if there's an error
          setIsSaved(true)
        }
      })
    } else {
      setIsSaved(true)
      savePost({ postId: post.$id, userId }, {
        onSuccess: () => {
          // Refresh user data after saving
          refetchCurrentUser()
        },
        onError: () => {
          // Revert the state if there's an error
          setIsSaved(false)
        }
      })
    }
  }

  return (
    <div className="flex justify-end items-center z-20">
      <img
        src={isSaved ? "/icons/saved.svg" : "/icons/save.svg"}
        alt="save"
        width={20}
        height={20}
        onClick={handleSavePost}
        className={isSaved ? "cursor-pointer filter-colored-icon" : "cursor-pointer brightness-0"}
      />
    </div>
  )
}

export default SaveBtn