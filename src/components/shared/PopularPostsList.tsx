// import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import Card from "../card/Card"
import { Separator } from "../ui/separator"
import PropertyCard from "./PropertyCard"


type GridPostListProps ={
    posts: Models.Document[]
}


const PopularPostsList = ({ posts }: GridPostListProps) => {
    // const { user } = useUserContext()

  return (
    <ul className="grid gap-0 w-full">
        {posts.map((item, index) => (
            <PropertyCard key={index} post={item} />
        ))}
    </ul>
  )
}

export default PopularPostsList
