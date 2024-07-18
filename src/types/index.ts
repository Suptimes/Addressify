export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name?: string;
    bio?: string;
    email?: string;
    imageId?: string;
    imageUrl?: URL | string;
    file?: File[];
    newPassword?: string;
    oldPassword?: string; //TO BE ADJUSTED TO PASSWORD IF NECESSARY
  };
  
  export type INewPost = {
    userId: string;
    title: string;
    files: File[];
    location?: string;
    price?: string;
    description?: string;
    type?: string;
    beds?: string;
    baths?: number;
    property?: string;
    duration?: string;
    cheques?: string;
    size?: string;
    city?: string;
    address?: string;
    category?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    title: string;
    imageIds: string[];
    imageUrls: string[];
    files: File[];
    location?: string;
    price?: number;
    description?: string;
    type?: string;
    beds?: string;
    baths?: string;
    property?: string;
    size?: string;
    duration?: string;
    cheques?: string;
    city?: string;
    address?: string;
    category?: string;
    // removeOldFiles: boolean;
    newFiles: File[];
    removedFileIndices: number[];
  };
  
  export type IUser = {
    id: string;
    name: string;
    // username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    // username: string;
    password: string;
  };

  export type ISave = {
    saveId: string
    posts: object | string
  }
 
  export type INewAvailability = {
    user: string
    datetime: string
    // date: string
    // time: string
    status: string
  }
  
  export type INewBooking = {
    user: string
    availability: string
    property: string
    booking: string
    status: string
    note: string
  }
  
export type IMessage = {
  content: string
  timestamp: string
  senderId: string
  chat: string
  seenBy: boolean
}

export type INewMessage = {
  body: string
  senderId: string
  timestamp: Date
  // tempId: string
}