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
    file: File[];
    location?: string;
    price?: string;
    description?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    title: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    price?: number;
    description?: string;
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