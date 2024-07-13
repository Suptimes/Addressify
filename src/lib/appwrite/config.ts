import { Client, Account, Databases, Storage, Avatars } from "appwrite"

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    propertyCollectionId: import.meta.env.VITE_APPWRITE_PROPERTY_COLLECTION_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    availabilityCollectionId: import.meta.env.VITE_APPWRITE_AVAILABILITY_COLLECTION_ID,
    bookingCollectionId: import.meta.env.VITE_APPWRITE_BOOKING_COLLECTION_ID,    
    userChatsCollectionId: import.meta.env.VITE_APPWRITE_USERCHATS_COLLECTION_ID,    
    chatsCollectionId: import.meta.env.VITE_APPWRITE_CHATS_COLLECTION_ID,    
    messagesCollectionId: import.meta.env.VITE_APPWRITE_MESSAGES_COLLECTION_ID,    
}



export const client = new Client()

client.setProject(appwriteConfig.projectId)
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)
