import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import "./singlePage.scss";
import BookAppointment from "../../components/shared/BookAppointment.tsx";
import { singlePostData, userData } from "../../lib/dummyData"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetCurrentUser, useGetPostById, useInitiateChat } from "../../lib/react-query/queriesAndMutations.tsx";
import { initiateChat } from "../../lib/appwrite/api.ts";

const SinglePage = () => {
  const [senderId, setSenderId] = useState(null);
  // const [chatId, setChatId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const { id: propertyId } = useParams();
  const navigate = useNavigate();

  const { data: sender, isLoading: isUserLoading } = useGetCurrentUser();
  const { data: property, isPending: isPropertyLoading } = useGetPostById(propertyId || "");
  // const { data: chat, initiate, isLoading: isChatLoading } = useInitiateChat();

  // useEffect(() => {
  //   if (chat && !isChatLoading) {
  //     setChatId(chat);
  //   }
  // }, [chat, isChatLoading]);

  useEffect(() => {
    if (sender && !isUserLoading) {
      setSenderId(sender.$id);
    }
  }, [sender, isUserLoading]);

  useEffect(() => {
    if (property && !isPropertyLoading) {
      setReceiverId(property.owner.$id);
    }
  }, [property, isPropertyLoading]);

  const handleSendMessage = async () => {
    const chatId = await initiateChat(senderId, receiverId);
    navigate(`/messages/${chatId}`);
  };

  // console.log("PARTICIPANTS:", senderId , receiverId)
  return (
    <div className="singlePage">
      
      <div className="details">
        <div className="wrapper">

          <Slider images={singlePostData.images}/>

          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{singlePostData.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="pin" />
                  <span>{singlePostData.address}</span>
                </div>
                <div className="price">$ {singlePostData.price}</div>
              </div>
              <div className="user">
                <img src={userData.img} alt="user image" />
                <span>Owner</span>
                {/* <span>{userData.name}</span> */}
              </div>
            </div>

            <div className="bottom">
              {singlePostData.description}
            </div>
          </div>
        </div>
      </div>


      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="utility" />
              <div className="featureText">
                <span>Utilities</span>
                <p>Tenant is responsible</p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="pet" />
              <div className="featureText">
                <span>Pet Policy</span>
                <p>Pets allowed</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Property Fees</span>
                <p>No fee. No comission.</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>800 sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>2 bedroom</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>2 bathroom</span>
            </div>
          </div>



          <p className="title">Nearby Places</p>
          <div className="listHoriz">

            <div className="feature">
                <img src="/school.png" alt="pet" />
                <div className="featureText">
                  <span>School</span>
                  <p>550m away</p>
                </div>
            </div>
            <div className="feature">
                <img src="/bus.png" alt="pet" />
                <div className="featureText">
                  <span>Bus/Tram Station</span>
                  <p>100m away</p>
                </div>
            </div>
            <div className="feature">
                <img src="/restaurant.png" alt="pet" />
                <div className="featureText">
                  <span>Restaurent</span>
                  <p>200m away</p>
                </div>
            </div>

          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[singlePostData]} />
          </div>
          <div className="buttons">
            <BookAppointment/>
            <button 
              className="group" 
              onClick={handleSendMessage}>
              <img src="/icons/chat.svg" alt="Send a message" className="brightness-0 group-hover:brightness-200"/>
              Send Message
            </button>
            {/* <button>
              <img src="/calendar1.png" alt="Send a message" />
              Book Tour
            </button> */}
            <button className="group">
              <img src="/icons/save.svg" alt="Save this property" className="brightness-0 group-hover:brightness-200" />
              Save Property
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePage
