import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import { CalendarDays, Clock, Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { useCreateAvailability } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const MultiAvailabilityForm = () => {
  const [availabilities, setAvailabilities] = useState([
    { date: new Date(), timeSlot: [] },
  ]);
  const [timeSlot, setTimeSlot] = useState([]);
  const { user } = useUserContext();
  const { mutateAsync: createNewAvailability, isPending: isCreatingAvail } = useCreateAvailability();

  // State to control the dialog open/close status
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getTime();
  }, []);

  const getTime = () => {
    const timeList = [];
    for (let i = 10; i <= 18; i++) {
      timeList.push({ time: `${i}:00` });
      timeList.push({ time: `${i}:30` });
    }
    setTimeSlot(timeList);
  };

  const isPastDay = (day) => {
    return day < new Date();
  };

  const handleAddAvailability = () => {
    setAvailabilities([
      ...availabilities,
      { date: new Date(), timeSlot: [] },
    ]);
  };

  const handleRemoveAvailability = (index) => {
    const newAvailabilities = availabilities.filter((_, i) => i !== index);
    setAvailabilities(newAvailabilities);
  };

  const handleDateChange = (index, date) => {
    const newAvailabilities = [...availabilities];
    newAvailabilities[index].date = date;
    setAvailabilities(newAvailabilities);
  };

  const handleTimeSlotChange = (index, time) => {
    const newAvailabilities = [...availabilities];
    const existingSlots = newAvailabilities[index].timeSlot;
    if (existingSlots.includes(time)) {
      newAvailabilities[index].timeSlot = existingSlots.filter((t) => t !== time);
    } else {
      newAvailabilities[index].timeSlot = [...existingSlots, time];
    }
    setAvailabilities(newAvailabilities);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Flatten the availabilities to individual datetime entries
      const promises = availabilities.flatMap(({ date, timeSlot }) => 
        timeSlot.map(async (time) => {
          const datetime = new Date(`${date.toISOString().split('T')[0]}T${time}:00Z`).toISOString();
          const slotToAdd = {
            user: user.id,
            datetime: datetime,
            status: "available",
          };
          await createNewAvailability(slotToAdd);
        })
      );

      await Promise.all(promises);
      setAvailabilities([{ date: new Date(), timeSlot: [] }]);
      // Close the dialog after successful submission
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error submitting availabilities:", err);
      alert("Failed to submit availabilities.");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <span className="group border-none">
          <Button className="border-none">Set Availability</Button>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center mt-2 text-xl md:pl-7">
            Set Availability
            <span className="mt-3">
              <Button type="button" onClick={handleAddAvailability}>
                Add Another Date
              </Button>
            </span>
          </DialogTitle>
          <DialogDescription>
            <div className="w-full pl-2 pr-1 flex flex-col">
              {availabilities.map((availability, index) => (
                <div key={index} className="flex flex-col">
                  <div className="mb-1 mt-3">
                    <Separator />
                  </div>
                  <div className="mt-3 flex justify-center items-start gap-5 rounded-xl">
                    <div className="flex flex-center items-center">
                      <div className="flex flex-col gap-3 items-baseline md:pl-5">
                        <h2 className="flex items-center gap-2 text-sm font-normal">
                          <CalendarDays className="text-primary-600" width={20} />
                          Select Date
                        </h2>
                        <Calendar
                          mode="single"
                          selected={availability.date}
                          onSelect={(date) => handleDateChange(index, date)}
                          disabled={isPastDay}
                          className="rounded-md border border-solid border-gray-300 max-md:scale-[1.15] max-md:my-5"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 items-baseline">
                      <h2 className="flex items-center gap-2 text-sm font-normal">
                        <Clock className="text-primary-600" width={20} />
                        Select Time Slots (one or more)
                      </h2>
                      <div className="rounded-md border border-solid border-gray-300 p-5 py-5 grid grid-cols-3 gap-2">
                        {timeSlot.map((item, idx) => (
                          <h4
                            key={idx}
                            className={`text-center flex-center text-black font-normal p-2 px-4 border-[1px] border-solid border-gray-300 rounded-xl hover:text-white hover:bg-primary-600 focus:bg-primary-600 cursor-pointer transition-all ease-in-out ${
                              availability.timeSlot.includes(item.time) && "bg-primary-600 text-white"
                            }`}
                            onClick={() => handleTimeSlotChange(index, item.time)}
                          >
                            {item.time}
                          </h4>
                        ))}
                      </div>
                    </div>
                    <div className="my-auto">
                      <span className="text-red-500">
                        <Button
                          type="button"
                          onClick={() => handleRemoveAvailability(index)}
                          variant="outline"
                          className="text-red-500 border-red-500 p-2 hover:bg-red-500 hover:text-white"
                        >
                          <Trash height={20} />
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end md:pr-2">
          <div className="flex-center gap-3">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={availabilities.length === 0 || availabilities.some(a => a.timeSlot.length === 0)}
            >
              Submit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MultiAvailabilityForm;