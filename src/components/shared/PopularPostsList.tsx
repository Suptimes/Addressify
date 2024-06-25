import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import Card from "../card/Card"


type GridPostListProps ={
    posts: Models.Document[]
}


const PopularPostsList = ({ posts }: GridPostListProps) => {
    const { user } = useUserContext()

  return (
    <ul className="grid gap-10 w-full">
        {posts.map((post) => (
            <li className="list-none" key={post.$id}>
                <Card item={post} />
            </li>
        ))}
    </ul>
  )
}

export default PopularPostsList
