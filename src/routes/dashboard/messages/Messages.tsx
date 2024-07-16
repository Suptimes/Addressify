import ChatDetails from "@/components/dashboard/messages/ChatDetails"
import ChatList from "@/components/dashboard/messages/ChatList"
import ChatMessages from "@/components/dashboard/messages/ChatMessages"
import { Separator } from "@/components/ui/separator"
import { useUserContext } from "@/context/AuthContext"

const Messages = () => {

  const { user } = useUserContext()

  const userId = user.id

  return (
    <div className="middlePage flex">
      <div className="flex-[2] h-[calc(100vh-60px)]">
        <ChatMessages />
      </div>
      <Separator className="h-[calc(100vh-60px)]" orientation="vertical"/>
      <div className="flex-[1] flex flex-col h-100 max-h-[calc(100vh-60px)]">
        <div className="max-h-[calc(30vh)] h-100">
          <ChatList userId={userId} />
        </div>
        <Separator/>
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
          <ChatDetails/>
        </div>
      </div>
    </div>
  )
}

export default Messages
