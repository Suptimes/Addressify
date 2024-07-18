import ChatDetails from "@/components/dashboard/messages/ChatDetails"
import ChatList from "@/components/dashboard/messages/ChatList"
import ChatMessages from "@/components/dashboard/messages/ChatMessages"
import { Separator } from "@/components/ui/separator"
import { useUserContext } from "@/context/AuthContext"
import { useGetChatById } from "@/lib/react-query/queriesAndMutations"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


const Messages = () => {

  const { user } = useUserContext()
  const { id:chatId } = useParams()
  const [ receiver, setReceiver ] = useState()
  const [showChatDetails, setShowChatDetails] = useState(false)

  const { data: chatContent, isPending: isChatIdLoading } = useGetChatById(chatId)
  
  
  const userId = user.id
  useEffect(()=>{
    if(chatContent && !isChatIdLoading) {
      setReceiver(chatContent?.participants.find((participant) => participant.$id !== userId))
    }
  }, [chatContent, isChatIdLoading])
  
  const toggleChatDetails = () => {
    setShowChatDetails((prev) => !prev);
  }
  const OpenChatDetails= () => {
    setShowChatDetails(true)
  }

  return (
    <div className="middlePage flex">
      <div className="flex-[2] h-[calc(100vh-60px)]">
        <ChatMessages userId ={userId} chatId={chatId} receiver={receiver} toggleChatDetails={toggleChatDetails} />
      </div>
      <Separator className="h-[calc(100vh-60px)] w-[0.5px]" orientation="vertical"/>
      <div className="flex-[1] flex flex-col h-100 max-h-[calc(100vh-60px)]">
        <div className={`${showChatDetails ? "max-h-[calc(35vh)]" : "h-full"}`}>
          <ChatList userId={userId} OpenChatDetails={OpenChatDetails} />
        </div>
        <Separator className="h-[0.5px]" />
        <div className={`flex-1 h-full overflow-y-auto custom-scrollbar ${showChatDetails ? '' : 'hidden'}`}>
          <ChatDetails receiver={receiver}/>
        </div>
      </div>
    </div>
  )
}

export default Messages
