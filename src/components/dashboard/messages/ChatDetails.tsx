import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner";
import { UserX2 } from "lucide-react"
import { useEffect, useState } from "react";
import { useBlockUser } from "@/lib/react-query/queriesAndMutations";

interface UserProp  {
  userId: string,
  receiver: {
    name: string; 
    imageUrl:string;
    $id: string;
  },
  userBlockedList: []
}

const ChatDetails = ({userId, receiver, userBlockedList}: UserProp) => {
  
  const receiverId = receiver?.$id

  const [isBlocking, setIsBlocking] = useState(false)
  const [receiverBlocked, setReceiverBlocked] = useState(false)
  const { mutate: blockOrUnblockUser } = useBlockUser(setReceiverBlocked);

  useEffect(() => {
    if (userBlockedList) {
        const receiverBlockedInitially = userBlockedList?.includes(receiverId);
        setReceiverBlocked(receiverBlockedInitially);
    }
}, [userBlockedList, receiverId]);

  

  const handleBlockOrUnblockUser = (userId, receiverId, setReceiverBlocked) => {
    setIsBlocking(true);
    blockOrUnblockUser({ userId, blockedUser: receiverId }, {
        onSuccess: () => {
            setIsBlocking(false);
            toast.success(receiverBlocked ? "User unblocked successfully" : "User blocked successfully");
        },
        onError: (error) => {
            setIsBlocking(false);
            console.error("Error blocking/unblocking user:", error);
            toast.error("Failed to block/unblock user");
        }
    });
};

  return (
    <div className="h-full flex flex-col p-3 pt-5 overflow-y-scroll custom-scrollbar justify-between">
      <div className="flex flex-col gap-3">
      {/* USER */}
      <div className="flex flex-col items-center gap-1">
        <img src={receiver?.imageUrl || "/icons/profile-placeholder.svg"} alt="user" className="rounded-full h-[55px] w-[55px]" />
        <h4>{receiver?.name || "User"}</h4>
        <p className="text-xs mt-[-3px]">Active</p>
      </div>
      <Separator className="h-[0.5px]"/>

      {/* INFO */}
      <div className="flex flex-col gap-2">
        {/* SETTINGS */}
        <div>
          <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">Chat Settings</span>
          <img src="/arrowDown.png" alt="arrow" height={12} className="brightness-50 cursor-pointer"/>
          </div>
          <div></div>
        </div>
        
        <Separator className="h-[0.5px]"/>

        {/* PRIVACY */}
        <div>
          <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-500">Privacy & Help</span>
          <img src="/arrowUp.png" height={12} alt="arrow" className="brightness-50 cursor-pointer"/>
          </div>
          <div></div>
        </div>
        
        <Separator className="h-[0.5px]"/>

        {/* PHOTOS */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-500">Shared Photos</span>
            <img src="/arrowUp.png" height={12} alt="arrow" className="brightness-50 cursor-pointer"/>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="https://images.pexels.com/photos/14578656/pexels-photo-14578656.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load" alt="" className="object-cover rounded-sm" height={30}/>
              <span className="text-sm">Photo_02_2024</span>
            </div>
            <div className="flex cursor-pointer">
              <img src="/download.png" height={16} alt="" className="brightness-50" />
            </div>
            
          </div>
          <Separator className="h-[0.5px]"/>
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center gap-2">
              <img src="https://images.pexels.com/photos/26595640/pexels-photo-26595640/free-photo-of-tokyo.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load" alt="" className="object-cover rounded-sm" height={30}/>
              <span className="text-sm">Photo_02_2024</span>
            </div>
            <img src="/download.png" height={16} alt="" className="brightness-50 cursor-pointer" />
          </div>
        </div>

      </div>

      </div>

      <div className="w-full flex">
        <Button 
            className="group w-full gap-2 bg-transparent text-red-500 border border-slate-300 border-solid hover:bg-red-500 hover:text-white"
            onClick={() => handleBlockOrUnblockUser(userId, receiverId, setReceiverBlocked)}
            disabled={isBlocking}
        >
            <UserX2 height={18} />
            {
                isBlocking ? (
                    <div className="flex-center gap-1">
                        Loading...
                    </div>
                ) : (
                    receiverBlocked ? (
                        "Unblock User"
                    ) : (
                        "Block User"
                    )
                )
            }
        </Button>
      </div>
    </div>
  )
}

export default ChatDetails
