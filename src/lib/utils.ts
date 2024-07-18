import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) === 1:
      return `${Math.floor(diffInHours)} hour ago`;
    case Math.floor(diffInHours) > 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) === 1:
      return `${Math.floor(diffInMinutes)} minute ago`;
    case Math.floor(diffInMinutes) > 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId)
}


// BOOKING FORMAT

export const formatDateTime = (isoString, locale = undefined, timeZone = undefined) => {
  const date = new Date(isoString); // ISO String is in UTC
  const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone
  };
  return date.toLocaleString(locale, options);
}

export const dubaiTimeToUTC = (date, time) => {
  const [hours, minutes] = time.split(':').map(Number);

  // Create a date object with Dubai time
  const localDateTime = new Date(date);
  localDateTime.setHours(hours);
  localDateTime.setMinutes(minutes);
  localDateTime.setSeconds(0);
  localDateTime.setMilliseconds(0);

  // Dubai is UTC+4, so subtract 4 hours to get UTC time
  const offset = 4 * 60 * 60 * 1000;
  const utcDateTime = new Date(localDateTime.getTime());

  // console.log("UTC IN FUNCTION:",utcDateTime)

  return utcDateTime.toISOString(); // Return ISO string in UTC
}