import "../card/card.scss"
import { Link } from "react-router-dom"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import SaveBtn from "../shared/SaveBtn"

type PostCardProps = {
  item: Models.Document
}

const Card2 = ({ item }: PostCardProps) => {
  const { user } = useUserContext()

  // Debugging logs
  console.log("Rendering Card with item:", item)

  if (!item) return null; // Ensure the item is valid

  // Fallback for missing owner
  const isOwner = item.owner?.accountId === user.id;

  return (
    <div className="card lg:h-[170px]">
      <Link to={`/property/${item.$id}`} className="imageContainer">
        <img src={item.imageUrl} alt="" className="max-w-[300px] max-lg:h-full" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/property/${item.$id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.location}</span>
        </p>
        <p className="price">$ {item.price}</p>

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="bedroom" />
              <span>{item.bedroom || 2}</span>
              <span className="max-md:hidden">bed(s)</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="bathroom" />
              <span>{item.bathroom || 2}</span>
              <span className="max-md:hidden">bath(s)</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon mb-[-2px]">
              {isOwner && (
                <Link to={`/edit-post/${item.$id}`}>
                  <img className="brightness-0" src="/icons/edit.svg" alt="edit"/>
                </Link>
              )}
            </div>
            <div className="icon">
              <SaveBtn post={item} userId={user.id} />
            </div>
            <div className="icon">
              <img className="brightness-0" src="/icons/chat.svg" alt="chat" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card2
