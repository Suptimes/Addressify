import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const ChatList = () => {
  return (
    <div className='flex flex-col gap-1 p-2 px-0 pb-0 h-full'>
        {/* SEARCH */}
        <div className="group flex-1 rounded-full flex items-center w-full px-2 mx-auto max-w-sm bg-slate-100 hover:bg-slate-200 focus-within:ring-2 ring-violet-800">
            <img 
                src="/icons/search.svg" 
                alt="search titles"
                className="pr-2 pl-3"
            />
            <Input
                placeholder="Search..."
                className="w-full border-none rounded-full bg-slate-100 group-hover:bg-slate-200 shad-input-2"
            />
        </div>

        {/* CHATS */}
        <div className='overflow-y-scroll custom-scrollbar h-fit'>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='rounded-full object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            <div className='flex p-3 hover:bg-slate-100 rounded-md'>
                <img src="/icons/profile-placeholder.svg" alt="chatter image" height={40} className='object-cover' />
                <div className='flex flex-col pl-3'>
                    <span className='font-semibold'>Randa Afas</span>
                    <p className='text-sm'>Hello</p>
                </div>
            </div>
            <Separator/>
            
        </div>
    </div>
  )
}

export default ChatList
