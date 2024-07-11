import ChatDetails from "@/components/dashboard/messages/ChatDetails"
import ChatList from "@/components/dashboard/messages/ChatList"
import ChatMessages from "@/components/dashboard/messages/ChatMessages"
import { Separator } from "@/components/ui/separator"

const Messages = () => {
  return (
    <div className="middlePage flex">
      <div className="flex-[2] h-[calc(100vh-60px)]">
        <ChatMessages />
      </div>
      <Separator className="h-[calc(100vh-60px)]" orientation="vertical"/>
      <div className="flex-[1] flex flex-col h-100 max-h-[calc(100vh-60px)]">
        <div className="max-h-[calc(30vh)] h-100">
          <ChatList/>
        </div>
        <Separator/>
        <div className="max-h-[calc(70vh)] h-full overflow-y-scroll custom-scrollbar">
          <ChatDetails/>
        </div>
      </div>
    </div>
  )
}

export default Messages
