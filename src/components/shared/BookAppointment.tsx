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
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import { ArrowRight, CalendarDays, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { useCreateBooking, useGetAvailByPropId } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import Loader from "./Loader"
import { dubaiTimeToUTC, formatDateTime } from "@/lib/utils"
import { useNavigate, useParams } from "react-router-dom"

const BookAppointment = () => {
    const [date, setDate] = useState(new Date())
    const [timeSlot, setTimeSlot] = useState([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [note, setNote] = useState("")
    const [availableSlots, setAvailableSlots] = useState([]) // State to hold available slots
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [availabilityId, setAvailabilityId] = useState(null)
    const navigate = useNavigate()

    const { user } = useUserContext()
    const { id:propertyId } = useParams()

    const { mutateAsync: createNewBooking, isPending, isSuccess: successBooking } = useCreateBooking()
    const { data: propertyAvailabilities, isLoading: isLoadingAvailabilities, isSuccess:successAvailLoading } = useGetAvailByPropId(propertyId)

    console.log("Availabilities:", availableSlots)
    console.log("Property:", propertyId)

    useEffect(() => {
        getTime()
    }, []);

    useEffect(() => {
        if (propertyAvailabilities && !isLoadingAvailabilities) {
            const slots = propertyAvailabilities.reverse().map(slot => ({
                datetime: new Date(slot.datetime),
                id: slot.$id
            }));
            setAvailableSlots(slots);
        }
    }, [propertyAvailabilities, isLoadingAvailabilities]);

    useEffect(() => {
        if (selectedTimeSlot) {
            const matchedSlot = availableSlots.find(slot => slot.datetime.toISOString() === selectedTimeSlot);
            setAvailabilityId(matchedSlot?.id || null);
        }
    }, [selectedTimeSlot, availableSlots])


    console.log("AvID:",availabilityId)

    const getTime = () => {
        const timeList = []
        for (let i = 10; i <= 18; i++) {
            timeList.push({ time: `${i}:00` })
            timeList.push({ time: `${i}:30` })
        }
        setTimeSlot(timeList)
    }

    const isPastDay = (day) => {
        return day < new Date()
    }

    const handleSubmit = async () => {
        if (!selectedTimeSlot) {
            toast.error("Please select a time slot.")
            return
        }
        
        // Set datetime based on whether propertyAvailabilities exist
        const bookingDatetime = propertyAvailabilities
            ? new Date(selectedTimeSlot).toISOString()
            : dubaiTimeToUTC(date, selectedTimeSlot)

        const bookingSlot = {
            user: user.id,
            property: propertyId,
            availability: availabilityId,
            note: note || "",
            booking: bookingDatetime,
            status: "Booked",
        }

        try {
            await createNewBooking(bookingSlot)
            setIsDialogOpen(false);
            toast.success("Booking successfully submitted.", {
                description: formatDateTime(bookingDatetime),
                action: {
                    label: "Manage",
                    onClick: () => navigate("/dashboard"),
                }
            })
        } catch (err) {
            console.error("Error submitting the booking:", err)
            toast.error("Failed to submit the booking.")
        }
    }

    if (isLoadingAvailabilities) {
        return (
            <div className="flex-center w-full">
                <Loader w={40} h={40} />
            </div>
        )
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="group">
                <img src="/calendar1.png" alt="Book a tour" className="brightness-0 group-hover:brightness-200" />
                Book Tour
            </DialogTrigger>
            <DialogContent className="max-md:h-[100vh] max-md:overflow-y-scroll max-md:custom-scrollbar max-md:max-w-[360px]">
                <DialogHeader>
                    <DialogTitle className="text-xl md:pl-7 ml-2">Book a Tour</DialogTitle>
                    <DialogDescription>
                        <div className="w-full ml-2 pl-2 pr-1">
                            <div className="flex max-md:flex max-md:flex-col max-md:justify-center max-md:items-center mt-3 gap-8 max-md:gap-4">
                                {/* CALENDAR */}
                                <div className={`${!isLoadingAvailabilities && availableSlots.length > 0 && "hidden"} flex flex-col gap-3 items-baseline md:pl-5`}>
                                    <h2 className="flex items-center gap-2 text-sm font-normal">
                                        <CalendarDays className="text-primary-600" width={20} />
                                        Select Date
                                    </h2>
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={isPastDay}
                                        className="rounded-md border border-solid border-gray-300 max-md:my-5"
                                    />
                                </div>
                                <div className={`${!isLoadingAvailabilities && availableSlots.length > 0 && "hidden"} my-auto max-md:hidden`}>
                                    <ArrowRight className="text-slate-300 scale-150" />
                                </div>
                                {/* TIME SLOT */}
                                <div className="flex flex-col w-full gap-3 items-baseline max-md:scale-105 max-md:pb-4">
                                    <h2 className="flex items-center gap-2 text-sm font-normal">
                                        <Clock className="text-primary-600" width={20} />
                                        Select Time
                                    </h2>
                                    <div className={`rounded-md border border-solid border-gray-300 p-5 py-5 ${availableSlots.length > 0 ? "grid grid-cols-2 w-full" : "grid grid-cols-3"} gap-2`}>
                                        {!isLoadingAvailabilities && availableSlots.length > 0 ? (
                                            availableSlots.map((slot, index) => (
                                                <h4
                                                    key={index}
                                                    className={`text-center flex-center text-black font-normal p-2 px-4 border-[1px] border-solid border-gray-300 rounded-xl hover:text-white hover:bg-primary-600 focus:bg-primary-600 cursor-pointer transition-all ease-in-out ${selectedTimeSlot === slot.datetime.toISOString() && "bg-primary-600 text-white"}`}
                                                    onClick={() => setSelectedTimeSlot(slot.datetime.toISOString())}
                                                >
                                                    {formatDateTime(slot.datetime.toISOString(), undefined, 'Asia/Dubai')}
                                                </h4>
                                            ))
                                        ) : (
                                            timeSlot.map((item, index) => (
                                                <h4
                                                    key={index}
                                                    className={`text-center flex-center text-black font-normal p-2 px-4 border-[1px] border-solid border-gray-300 rounded-xl hover:text-white hover:bg-primary-600 focus:bg-primary-600 cursor-pointer transition-all ease-in-out ${selectedTimeSlot === item.time && "bg-primary-600 text-white"}`}
                                                    onClick={() => setSelectedTimeSlot(item.time)}
                                                >
                                                    {item.time}
                                                </h4>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Textarea
                                className="shad-textarea mt-3 max-h-[70px] md:w-[89.7%] md:ml-5"
                                placeholder="Note to the owner... (optional)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end md:pr-2">
                    <DialogClose asChild>
                        <div className="flex-center gap-3">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}>
                                Close
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!(date && selectedTimeSlot) || isPending}
                            >
                                {isPending ? 
                                    <div className="flex gap-2">
                                        <Loader h={17} w={17} brightness="brightness-200" /> Loading...
                                    </div>
                                : "Submit"}
                            </Button>
                        </div>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookAppointment