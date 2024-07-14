import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Image, SendHorizontal, SmileIcon } from "lucide-react"
import { useEffect, useRef } from "react"


const ChatMessages = () => {
  const otherMsg = false
  const ownMsg = true

  const endRef = useRef(null)

  useEffect(()=>{
    endRef.current?.scrollIntoView({ behavior: "smooth"})
  }, [])
  
  return (
    <div className="flex flex-col w-full h-full">
      {/* TOP SCTION */}
      <div className="flex p-2 items-center justify-between">
        <div className="flex items-center px-3 gap-5">
          <img src="/icons/profile-placeholder.svg" alt="chatter image" height={50} width={50} className="object-cover rounded-full" />
          <div className="flex flex-col">
            <span className="text-lg font-bold">Mark Cuban</span>
            <p className="font-light text-sm mt-[-3px]">Let's close this deal</p>
          </div>
        </div>
        <img src="/info.png" alt="user details" height={20} className="brightness-50 pr-2 cursor-pointer" />
      </div>
      <Separator/>

      {/* MIDDLE SECTION */}
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


      <Separator className="h-[0.5px] mb-2"/>

      {/* BOTTOM SECTION */}
      <div className="flex items-center justify-between gap-3 px-2 rounded-md pt-1 pb-3">
        <div className="flex-center">
          <Image className="text-primary-600 h-[23px] w-[23px] cursor-pointer"/>
        </div>
        <Input className="px-3 bg-slate-100 hover:bg-slate-200 flex-1 h-fit" placeholder="Write a message..." />
        {/* <div className="flex-center">
          <SmileIcon className="text-gray-600 h-[20px] w-[20px] cursor-pointer"/>
        </div> */}
        <Button className="flex-center h-fit"><SendHorizontal className="h-5 w-5"/></Button>
      </div>
    </div>
  )
}

export default ChatMessages
