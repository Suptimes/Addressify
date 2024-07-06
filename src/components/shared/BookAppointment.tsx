import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { CalendarDays, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

const BookAppointment = () => {
    const [ date, setDate ] = useState(new Date())
    const [ timeSlot, setTimeSlot ] = useState()
    const [ selectedTimeSlot, setSelectedTimeSlot ] = useState()

    useEffect(()=>{
        getTime()
    }, [])

    const getTime = () => {
        const timeList = []
        for (let i = 10; i<= 18; i++) {
            timeList.push({
                time: i + ":00"
            })
            timeList.push({
                time: i + ":30"
            })
        }
        // for (let i = 1; i<= 6; i++) {
        //     timeList.push({
        //         time: "0"+i + ":00 PM"
        //     })
        //     timeList.push({
        //         time: "0"+i + ":30 PM"
        //     })
        // }

        setTimeSlot(timeList)
    }

    const isPastDay = (day) => {
        return day<new Date()
    }


  return (
    <Dialog>
        <DialogTrigger className="group">
            <img src="/calendar1.png" alt="Send a message" className="brightness-0 group-hover:brightness-200" />
            Book Tour
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-xl md:pl-7">Book a Tour</DialogTitle>
            <DialogDescription>
                <div className="w-full pl-2 pr-1">
                    <div className="max-md:gap-4 md:grid max-md:flex max-md:flex-col max-md:justify-center max-md:items-center md:grid-cols-2 mt-3">
                        {/* CALENDAR */}
                        <div className="flex flex-col gap-3 items-baseline md:pl-5">
                            <h2 className="flex items-center gap-2 text-sm font-normal">
                                <CalendarDays className="text-primary-600" width={20}/>
                                Select Date
                            </h2>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={isPastDay}
                                className="rounded-md border border-solid border-gray-300 max-md:scale-[1.15] max-md:my-5"
                            />
                        </div>
                        {/* TIME SLOT */}
                        <div className="flex flex-col gap-3 items-baseline">
                            <h2 className="flex items-center gap-2 text-sm font-normal">
                                    <Clock className="text-primary-600" width={20}/>
                                    Select Time
                            </h2>
                            <div className="rounded-md border border-solid border-gray-300 p-5 py-5 grid grid-cols-3 gap-2">
                                {timeSlot?.map((item,index)=>(
                                    <h4 
                                    className={`text-center flex-center text-black font-normal p-2 px-4 border-[1px] border-solid border-gray-300 rounded-xl hover:text-white hover:bg-primary-600 focus:bg-primary-600 cursor-pointer transition-all ease-in-out ${selectedTimeSlot===item.time && "bg-primary-600 text-white"}`} 
                                    key={index}
                                    onClick={()=>setSelectedTimeSlot(item.time)}
                                    >{item.time}</h4>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Textarea className="shad-textarea mt-3 max-h-[70px] md:w-[92.4%] md:ml-5" placeholder="Note to the owner... (optional)" />
                </div>
            </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end md:pr-2">
                <DialogClose asChild>
                    <div className="flex-center gap-3">
                        <Button type="button" variant="outline">
                        Close
                        </Button>
                        <Button type="button"
                        disabled={!(date&&selectedTimeSlot)}>
                        Submit
                        </Button>
                    </div>
                </DialogClose>
                </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default BookAppointment
