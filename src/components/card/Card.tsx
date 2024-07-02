import "./card.scss"
import { Link } from "react-router-dom"
import { Models } from "appwrite"
// import { formatDateString, multiFormatDateString } from "@/lib/utils"
import { useUserContext } from "@/context/AuthContext"
import SaveBtn from "../shared/SaveBtn"
import { Separator } from "../ui/separator"


type PostCardProps = {
  item: Models.Document
}


const Card = ({item}: PostCardProps) => {
  const { user } = useUserContext()
  
  if (!item) return null; // Ensure the item is valid
  if(!item.owner) return


  return (
    <div className="card pl-1 lg:h-[170px]">
      <Link to={`/property/${item.$id}`} className="imageContainer py-1">
        <img src={item.imageUrl} alt="" className="max-w-[300px] max-lg:h-full" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/property/${item.$id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="pinpoint" />
          <span>{item.location}</span>
        </p>
        <p className="price">$ {item.price}</p>

        {/* <div><p className="subtle-semibold lg:small-regular">
            {multiFormatDateString(item.$createdAt)}
            </p></div> */}

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/size.png" alt="size" />
              <span>{item.size || 1500}</span>
              <span className="max-lg:hidden">sqrf</span>
            </div>
            <Separator orientation="vertical" />
            <div className="feature">
              <img src="/bed.png" alt="bedrooms" />
              <span>{item.beds || 2}</span>
              <span className="max-lg:hidden">bed(s)</span>
            </div>
            <Separator orientation="vertical" />
            <div className="feature">
              <img src="/bath.png" alt="bathrooms" />
              <span>{item.baths || 2}</span>
              <span className="max-lg:hidden">bath(s)</span>
            </div>
          </div>


          <div className="icons">
          
            <div className="icon mb-[-2px]">
              <Link className={`${user.id !== item.owner.$id && "hidden"}`} to={`/edit-post/${item.$id}`}>
                <img className="brightness-0" src="/icons/edit.svg" alt="edit"/>
              </Link>
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

export default Card
