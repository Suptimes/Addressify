import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { deleteMessage } from "@/lib/appwrite/api";
import { appwriteConfig } from "@/lib/appwrite/config";
import { useCreateMessage, useGetChatMessages } from "@/lib/react-query/queriesAndMutations";
import { multiFormatDateString } from "@/lib/utils";
import { Client } from "appwrite";
import { AlertTriangle, Check, Image, SendHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

interface ChatProps {
  userId: string;
  chatId: string;
  receiver: {
    name: string;
    imageUrl: string;
    $id: string;
    blockedUsers: []
  }
  toggleChatDetails: () => void
  setLastMessage: () => void
  userBlockedList: []
}

const ChatMessages = ({ userId, chatId, receiver, toggleChatDetails, userBlockedList, setLastMessage }: ChatProps) => {

  const [ value, setValue ] = useState("");
  const [ messages, setMessages ] = useState([]);
  const [ receiverBlocked, setReceiverBlocked ] = useState(false);
  const [ senderBlocked, setSenderBlocked ] = useState(false);
  const { id:xChat } = useParams()

  const endRef = useRef(null);

  const limit = 20;
  const offset = 0;
  const receiverId = receiver?.$id
  const receiverBlockedList = receiver?.blockedUsers

  const { data: allMessages, isPending: isMessagesLoading } = useGetChatMessages(chatId, limit, offset);
  const { mutate: sendMessage } = useCreateMessage();


  useEffect(() => {
    if (allMessages && !isMessagesLoading) {
      const formattedMessages = allMessages.map(message => ({
        body: message.body,
        senderId: message.senderId.$id,
        timestamp: message.$createdAt,
        id: message.$id,
        check: message.check,
      }));
      setMessages(formattedMessages.reverse());
    }
  }, [isMessagesLoading, xChat, deleteMessage]);

  useEffect(() => {
      if (userBlockedList) {
          const receiverBlockedInitially = userBlockedList?.includes(receiverId);
          setReceiverBlocked(receiverBlockedInitially);
      }
  }, [userBlockedList, receiverId]);
  
  useEffect(() => {
      if (receiverBlockedList) {
          const senderBlocked = receiverBlockedList?.includes(userId);
          setSenderBlocked(senderBlocked);
      }
  }, [receiverBlockedList, userId])
  

  useEffect(() => {
    const client = new Client();
  
    client.setProject(appwriteConfig.projectId)
          .setEndpoint(appwriteConfig.url);
  
    const unsubscribe = client.subscribe(`databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatsCollectionId}.documents.${chatId}`, response => {

      console.log("response",response)
      if (response?.events.includes("databases.*.collections.*.documents.*.update")) {
        const { lastMessage, lastMessageSender } = response.payload;

        setLastMessage(lastMessage)
  
        if (lastMessageSender !== userId) {
          const newMessageToShow = {
            body: lastMessage,
            senderId: lastMessageSender,
            timestamp: new Date().toISOString(),
            tempId: `temp-${Date.now()}`
          };
  
          setMessages(prevMessages => [
            ...prevMessages,
            newMessageToShow,
          ]);
        }
  
        endRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, [chatId, userId]);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageToSend = {
      body: value,
      senderId: userId,
      timestamp: new Date().toISOString(),
    };
    const messageToShow = {
      body: value,
      senderId: userId,
      timestamp: new Date().toISOString(),
      tempId: `temp-${Date.now()}`, // Temporary ID to distinguish the message
    };

    const seenBy = [userId];

    // Optimistically add the message to the state
    setMessages(prevMessages => [
      ...prevMessages,
      {
        ...messageToShow,
        senderId: userId,
        status: 'sending',
      },
    ]);

    setValue("");

    sendMessage(
      { message: messageToSend, chatId: chatId, seenBy: seenBy, lastMessageSender: userId },
      {
        onSuccess: (data) => {
          // Update the message status to 'sent'
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.tempId === messageToShow.tempId
                ? { ...msg, id: data.$id, status: 'sent' }
                : msg
            )
          );
        },
        onError: (error) => {
          // Update the message status to 'failed'
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.tempId === messageToShow.tempId
                ? { ...msg, status: 'failed' }
                : msg
            )
          );
          console.error("Failed to send message:", error);
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId)
    setMessages(prev => messages.filter(message=> message.id !== messageId))
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* TOP SECTION */}
      {chatId !== "chat" && (<>
      <div className="flex p-2 items-center justify-between">
        <div className="flex items-center px-3 gap-5">
          <img
            src={receiver?.imageUrl || "/icons/profile-placeholder.svg"} // SKELETON LOADING
            alt="user image"
            height={50}
            width={50}
            className="object-cover rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold">{receiver?.name || ""}</span>
            <p className="font-light text-sm mt-[-3px]">Let's close this deal</p>
          </div>
        </div>
        <img
          src="/info.png"
          alt="user details"
          height={20}
          className="filter-colored-icon brightness-100 pr-2 cursor-pointer"
          onClick={toggleChatDetails}
        />
      </div>
      <Separator /></>)}

      {/* MIDDLE SECTION */}
      {chatId !== "chat" ? (
        <div className="flex-1 flex flex-col bg-slate-100 p-5 py-2 gap-2 w-full overflow-y-auto custom-scrollbar">
          {isMessagesLoading ? (
            <h4 className="flex-center w-full h-full gap-3">
              <Loader brightness="brightness-50" />
            </h4>
          ) : allMessages === undefined ? (         
            <div className="flex-center w-full h-full bg-slate-100">
              <h4>Write a message to start a conversation</h4>
            </div>
          ) : (
            messages.map((message, index) => {
              const ownMsg = userId === message?.senderId;
              const messageSent = message?.check === true
              return (
                <div
                  key={index}
                  className={`max-w-[70%] flex flex-col ${ownMsg ? "self-end" : "self-start"} group relative`}
                >
                  <div className={`p-3 rounded-md text-base font-medium w-fit ${ownMsg ? "bg-purple-200 self-end" : "bg-slate-200 self-start"}`}>
                    {message?.body}
                  </div>
                  <div className={`p-[2px] text-[10px] flex w-full ${ownMsg ? "justify-end" : "justify-start"}`}>
                    {message?.status === 'failed' 
                      ? 
                      (
                        <div className="flex gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />Not sent
                        </div>
                      ) 
                      : 
                      (
                        <div className="flex gap-1">
                          {ownMsg && 
                    <div className="hidden hover:flex group-hover:flex">
                    <Trash2 height={14} width={14} className="text-red-500 cursor-pointer" onClick={()=>handleDeleteMessage(message?.id)}/>
                    </div> }
                          {multiFormatDateString(message?.timestamp)}{ownMsg && messageSent && <Check className="h-[14px] w-[14px] text-primary-500"/>}{ownMsg && message?.status === 'sent' && <Check className="h-[14px] w-[14px] text-primary-500"/>}
                        </div>
                      )
                    }
                  </div>
                </div>
              )
            })
          )}
          {(receiverBlocked || senderBlocked) && (
              <div className="flex mx-auto text-center p-3 text-slate-600 text-sm">
                You cannot send a message to this user!
              </div>
            )}
          <div ref={endRef}></div>
        </div>
      ) : (
        <div className="flex-center h-full w-full bg-slate-100">
          <h4>Click on a chat to start a conversation</h4>
        </div>
      )}
      <Separator className="h-[0.5px] mb-2" />

      {/* BOTTOM SECTION */}
      {
        !receiverBlocked && !senderBlocked && (
          <div className="flex items-center justify-between gap-3 px-2 rounded-md pt-1 pb-3">
            <Button className="p-0 flex-center bg-transparent hover:bg-transparent" disabled={receiverBlocked}>
              <Image className="text-primary-600 h-[23px] w-[23px] cursor-pointer" />
            </Button>
            <Input
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="px-3 bg-slate-100 hover:bg-slate-200 flex-1 h-fit"
              placeholder= {receiverBlocked ? "You cannot send a message to this user" : "Write a message..."}
              disabled={receiverBlocked}
            />
            <Button type="submit" className="flex-center h-fit" onClick={handleSubmit} disabled={receiverBlocked}>
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        )
      }
      
    </div>
  );
};

export default ChatMessages;


// const { data: chatContent, isPending: isChatIdLoading } = useGetChatById(chatId)
// const receiverId = chatContent?.chatters.find((chatter) => chatter !== userId)

// useEffect(()=>{
  //   if(chatContent && !isChatIdLoading){
    //     setChat(chatContent)
    //   }
    // }, [chatContent, isChatIdLoading])


{/* {chatId !== "chat" ? (
  <div className="flex-1 flex flex-col bg-slate-100 p-5 py-2 gap-2 w-full overflow-y-auto custom-scrollbar">
  
  <div className={`max-w-[70%] flex ${ownMsg ? "self-end" : "self-start"}`}>
  <div>
  <div className={`${ownMsg ? "bg-secondary-300" : "bg-slate-200"} p-3 rounded-md text-base`}>
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim eligendi atque maiores, consectetur consequatur impedit laboriosam accusamus nobis
  </div>
  <p className="p-1 text-xs italic">1 min ago</p>
  </div>
  </div>
  
  <div className={`max-w-[70%]  flex ${ownMsg ? "self-end" : "self-start"}`}>
  <div className="flex flex-col  items-end">
              <img src="https://images.pexels.com/photos/18041018/pexels-photo-18041018/free-photo-of-las-vegas-illuminated-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=600" className="object-cover rounded-md max-w-[100%] max-h-[230px]" alt="" />
              <p className="p-1 text-xs italic self-start">1 min ago</p>
            </div>
          </div>

          <div className={`max-w-[70%] max-md:max-w-[80%] flex gap-5 ${otherMsg && "justify-end"}`}>
            <div>
              <p className={`${otherMsg ? "bg-secondary-300" : "bg-slate-200"} p-3 rounded-md text-base`}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim eligendi atque maiores, consectetur consequatur impedit laboriosam accusamus nobis
              </p>
              <p className="p-1 text-xs italic">1 min ago</p>
            </div>
          </div>
          <div className={`max-w-[70%]  max-md:max-w-[80%] flex gap-5 ${otherMsg && "justify-end"}`}>
            <div>
              <img src="https://images.pexels.com/photos/6039247/pexels-photo-6039247.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" className="object-cover rounded-md h-[200px] w-100" />
              <p className="p-1 text-xs italic">1 min ago</p>
            </div>
          </div>
        <div ref={endRef}></div>
        </div>
      ) : (
        <div className="flex-center h-full w-full bg-slate-100">
          <h4>Click on a chat to start a conversation</h4>
        </div>
     )} */}