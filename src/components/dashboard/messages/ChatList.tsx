import Loader from '@/components/shared/Loader'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useGetUserChats } from '@/lib/react-query/queriesAndMutations'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

interface ListProp {
    userId: string;
    OpenChatDetails: () => void;
    lastMessage: string
}

const ChatList = ({ userId, OpenChatDetails, lastMessage }: ListProp) => {
    const [ userChats, setUserChats ] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const { id: chatId } = useParams()

    const {data: userChatsList, isPending: isUserChatsLoading} = useGetUserChats(userId)

    useEffect(() => {
        if (userChatsList && !isUserChatsLoading) {
            const allChats = userChatsList.documents[0].chats;
            const sortedChats = allChats.sort((a, b) => new Date(b?.lastUpdated) - new Date(a?.lastUpdated));
            setUserChats(sortedChats);
        }
    }, [userChatsList, isUserChatsLoading]);
    
    if (isUserChatsLoading) {
        return (
            <div className='p-10 flex-center w-full h-full'>
               <Loader h={25} w={25} brightness='brightness-0'/> 
            </div>
        )  
    }

    const filteredChats = userChats?.filter((chat) => {
        const receiver = chat.participants.find((participant) => participant.$id !== userId);
        return receiver?.name.toLowerCase().includes(searchTerm.toLowerCase());
    })

  return (
    <div className='flex flex-col gap-1 p-2 px-0 pb-0 h-full'>
        {/* SEARCH */}
        <div className="group rounded-full flex items-center w-full px-2 mx-auto max-w-sm bg-slate-100 hover:bg-slate-200 focus-within:ring-2 ring-violet-800">
            <img 
                src="/icons/search.svg" 
                alt="search titles"
                className="pr-2 pl-3"
            />
            <Input
                placeholder="Search by Name"
                className="w-full border-none rounded-full bg-slate-100 group-hover:bg-slate-200 shad-input-2"
                onChange={(e)=>setSearchTerm(e.target.value)}
            />
        </div>

        {/* CHATS */}
        <div className='overflow-y-auto flex flex-col custom-scrollbar h-fit w-full'>
                {filteredChats && filteredChats.length > 0 ? (
                    filteredChats.map((chat) => {
                        // Filter out the current user from participants to get the receiver's details
                        const receiver = chat.participants.find(participant => participant.$id !== userId);

                        return (
                            <Link to={`/messages/${chat.$id}`} onClick={OpenChatDetails} className='w-full h-full hover:cursor-pointer' key={chat.$id}>
                                <div key={chat.$id} className='flex p-3 gap-3 hover:bg-slate-100 rounded-md w-full'>
                                    <img
                                        src={receiver?.imageUrl || "/icons/profile-placeholder.svg"}
                                        alt="user"
                                        height={40}
                                        className='rounded-full object-cover'
                                    />
                                    <div className='flex flex-col w-full'>
                                        <span className='font-semibold'>
                                            {receiver?.name || "User"}
                                        </span>
                                        <p className='text-sm'>{
                                            chatId === chat?.$id ?
                                                lastMessage !== "" ? lastMessage : chat?.lastMessage || "Start a conversation..."
                                                : chat?.lastMessage || "Start a conversation..."
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <Separator className='h-[0.5px]' />
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className='h-full flex-center p-5'>No chats found.</div>
                )}
            </div>
    </div>
  )
}

export default ChatList
