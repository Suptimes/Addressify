import {ID, ImageGravity, Query} from "appwrite"
import { account, appwriteConfig, avatars, databases, storage } from "./config"
import { IMessage, INewAvailability, INewBooking, INewMessage, INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"


// USER SECTION
export async function createUserAccount(user: INewUser){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )

        if(!newAccount) throw new Error("Account creation failed")

        const avatarUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId: newAccount.$id, //thats how appwrite store id
            email: newAccount.email,
            name: newAccount.name,
            // username: user.username,
            imageUrl: avatarUrl, //add .toString() to avoid URL type if needed
        })

        return newUser
        
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl?: URL;
    // username?: string;
}) {

    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
        )

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userChatsCollectionId,
            ID.unique(),
            {
                user: newUser.$id,
                chats: [],
            }
        )

        return newUser
    } catch (error) {
        console.log(error)
    }
}


export async function signInAccount(user: { email: string; password: string; }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password)
        
        return session
    } catch (error) {
        console.log(error)
    }
}


export async function getCurrentUser() {
    try {
        const currentAccount = await account.get()

        if(!currentAccount) throw new Error("No current account")

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw new Error("No user found")

        return currentUser.documents[0]

    } catch(error) {
        console.log(error)
    }
}

export async function signOutAccount (){
    try {
        
        localStorage.setItem('isAuthd', 'false')
        localStorage.removeItem('isAuthd')
        const session = await account.deleteSession("current")
        window.location.reload() // to be changed asap
        return session
    } catch (error) {
        console.log(error)
    }
}

// PROPERTY SECTION


export async function createPost (post: INewPost) {
    try{
        // Array to store uploaded file URLs and IDs
        const imageUrls: string[] = [];
        const imageIds: string[] = [];

        // Loop through each file and upload it
        for (const file of post.files) {
            const uploadedFile = await uploadFile(file);
            if (!uploadedFile) throw new Error('File upload failed');

            const fileUrl = await getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error('Failed to generate file URL');
            }

            // Ensure fileUrl is valid
            if (typeof fileUrl !== 'string' || fileUrl.length > 2000) {
                await deleteFile(uploadedFile.$id);
                throw new Error('Invalid file URL');
            }

            imageUrls.push(fileUrl);
            imageIds.push(uploadedFile.$id);
        }

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            ID.unique(),
            {
                owner: post.userId,
                title: post.title,
                imageUrls,  // Store an array of image URLs
                imageIds,   // Store an array of image IDs
                // imageUrl: fileUrl,
                // imageId: uploadedFile.$id,
                location: post.location,
                price: post.price,
                description: post.description,
                type: post.type,
                beds: post.beds,
                baths: post.baths,
                property: post.property,
                size: post.size,
                duration: post.duration,
                cheques: post.cheques,
                city: post.city,
                address: post.address,
                category: post.category,
            }
        )

        if(!newPost) {
            // Clean up by deleting uploaded files if document creation fails
            for (const imageId of imageIds) {
                await deleteFile(imageId);
            }
            throw new Error('Failed to create document')
        }

        return newPost
    } catch (error) {
        console.log('Error creating post:', error)
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )

        return uploadedFile
    } catch (error) {
        console.log(error)
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileObject = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            1800,
            1800,
            ImageGravity.Center,
            70,
        )

        if (!fileObject) throw new Error('Failed to generate file preview URL');
        
        // Convert URL object to string
        const fileUrl = fileObject.toString()

        return fileUrl
    } catch (error) {
        console.log('Error getting file preview:', error)
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId)

        return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.propertyCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )

    if(!posts) throw new Error("Failed to get recent posts.")

    return posts
}


export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            postId,
            {
                likes: likesArray
            }
        )

        if(!updatedPost) throw new Error("Like did not register.")

            return updatedPost
    } catch (error) {
        console.log(error)
    }
}


export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )

        if(!updatedPost) throw new Error("Save did not register.")

            return updatedPost
    } catch (error) {
        console.log(error)
    }
}


export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        )

        if(!statusCode) throw new Error("Delete saved post did not register.")

            return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}


export async function getPostById(postId?: string) {
    if (!postId) throw Error;

    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            postId
        )
        if (!post || Object.keys(post).length === 0) {
            throw new Error("Post not found.")
        }
        
        return post
    } catch (error) {
        console.log(error)
    }
}


export async function updatePost (post: IUpdatePost) {
    const hasNewFiles = post.newFiles && post.newFiles.length > 0;
    const { newFiles, removedFileIndices } = post;

    try{
        // Fetch the current user to validate ownership
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("Unable to retrieve current user");
        }

         // Fetch the existing post to validate the owner
         const existingPost = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            post.postId
        );

        if (!existingPost) {
            throw new Error("Post not found");
        }

        // Check if the logged-in user is the owner of the post
        if (existingPost.owner.accountId !== currentUser.accountId) {
            throw new Error("You are not authorized to edit this post");
        }

        // Prepare new image data
        let updatedImageUrls = [...existingPost.imageUrls];
        let updatedImageIds = [...existingPost.imageIds];


        // Remove old files if needed
        if (removedFileIndices.length > 0) {
        removedFileIndices.forEach(index => {
            if (index < updatedImageUrls.length && index < updatedImageIds.length) {
            updatedImageUrls.splice(index, 1);
            updatedImageIds.splice(index, 1);
            }
        });
        }
            // Upload new files
        if (hasNewFiles) {
            for (const file of newFiles) {
            const uploadedFile = await uploadFile(file);
            if (!uploadedFile) throw new Error('File upload failed');
    
            const fileUrl = await getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error('Failed to generate file URL');
            }
    
            updatedImageUrls.push(fileUrl);
            updatedImageIds.push(uploadedFile.$id);
            }
        }

        // Update post in the database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            post.postId,
            {
                title: post.title,
                imageUrls: updatedImageUrls,
                imageIds: updatedImageIds,
                location: post.location,
                price: post.price,
                description: post.description,
                type: post.type,
                beds: post.beds,
                baths: post.baths,
                size: post.size,
                property: post.property,
                duration: post.duration,
                cheques: post.cheques,
                city: post.city,
                address: post.address,
                category: post.category,
            }
        )

        if(!updatedPost) {
            // if (hasFileToUpdate) {
            //     await deleteFile(image.imageId);
            // }
            throw new Error('Failed to update document')
        }

        // Delete the old image if a new one was uploaded successfully
        // if (hasFileToUpdate && post.imageId && post.imageId !== image.imageId) {
        //     await deleteFile(post.imageId);
        // }

        return updatedPost
    } catch (error) {
        console.log('Error updating post:', error)
        throw error
    }
}


export async function deletePost (postId: string, imageId: string) {
    if(!postId || !imageId) throw new Error("Cannot find post to delete.")
        
        try {
            await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            postId,
        )
        
        return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}


export async function getInfinitePosts({ pageParam }: {pageParam: number}) {
    const queries : any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)]

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            queries
        )
        
        if(!posts) throw new Error("No posts found")
            
            return posts
        } catch (error) {
            console.log(error)
        }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            [Query.search("title", searchTerm)]
        )
        
        if(!posts) throw new Error("No posts found")

            return posts
        } catch (error) {
            console.log(error)
    }
}


export async function getSaveById(saveId?: string) {
    if (!saveId) throw new Error("Save Id required")
    
    try {
        const save = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            saveId
        )
        if (!save || Object.keys(save).length === 0) {
            throw new Error("Save not found.")
        }
        
        return save
    } catch (error) {
        console.error("Error fetching save by ID:", error)
        throw new Error("Failed to fetch the save. Please try again later.")
    }
}


export async function getUserById(userId?: string) {
    if (!userId) throw new Error("User ID is required")

    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        )

        if (!user || Object.keys(user).length === 0) {
            throw new Error("User not found.")
        }
        
        return user
    } catch (error) {
        console.log(error)
    }
}

// PROFILE SECTION

export async function updateProfile (user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0
    
    try{
        
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId,
        }        

        if(hasFileToUpdate) {
            const uploadedFile = await uploadFile(user.file[0])
            if(!uploadedFile) {
                throw new Error('File upload failed')
            }

            // Get file URL
            const fileUrl = await getFilePreview(uploadedFile.$id)
            if(!fileUrl) {
                await deleteFile(uploadedFile.$id)
                throw new Error('Failed to generate file URL')
            }

            // Check the file URL validity
            if (typeof fileUrl !== 'string' || fileUrl.length > 2000) {
                await deleteFile(uploadedFile.$id);
                throw new Error('Invalid file URL');
            }

            // Assign new image details
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }

        }


        // Update user in the database
        const updatedProfile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                email: user.email,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                bio: user.bio,
            }
        )

        if(!updatedProfile) {
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            throw new Error('Failed to update document')
        }

        // Delete the old image if a new one was uploaded successfully
        if (hasFileToUpdate && user.imageId && user.imageId !== image.imageId) {
            try {
                await deleteFile(user.imageId);
              } catch (error) {
                console.error('Error deleting old image:', error);
              }
        }

        return updatedProfile
    } catch (error) {
        console.log('Error updating profile:', error)
        throw error
    }
}


export async function getSavesByIds(ids: string[]) {
    if (!ids || ids.length === 0) throw new Error("No IDs provided");
    
    try {
        // Use the `equal` query to fetch documents with the provided IDs
        const result = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal('$id', ids)]
        );
        return result.documents;
    } catch (error) {
        console.error('Failed to fetch documents:', error);
        throw error;
    }
}


// AVAILABILITY SECTION

export async function createAvailability(avail: INewAvailability) {
    try {
        const availabilities = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.availabilityCollectionId,
            ID.unique(),
            {
                user: avail.user,
                datetime: avail.datetime,
                // date: avail.date,
                // time: avail.time,
                status: avail.status,
            }
        )

        if(!availabilities) throw new Error("availability did not register.")

            return availabilities
    } catch (error) {
        console.log(error)
    }
}


export async function deleteAvailability(availabilityId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            availabilityId,
        )

        if(!statusCode) throw new Error("Delete availabilities did not register.")

            return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}


export async function getAvailabilitiesByPropertyId(propertyId: string) {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.availabilityCollectionId,
            [
                Query.equal("property", propertyId),
                Query.equal("status", "available")
            
            ]
        );

        if (!response.documents) {
            throw new Error("Failed to get the availabilities.");
        }

        return response.documents; // Make sure to return documents
    } catch (error) {
        console.error("Error fetching availabilities:", error);
        throw new Error("Failed to get the availabilities.");
    }
}


// BOOKING SECTION

export async function createBooking(booking: INewBooking) {
    try {
        const bookingSlot = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.bookingCollectionId,
            ID.unique(),
            {
                user: booking.user,
                property: booking.property,
                availability: booking.availability,
                booking: booking.booking, //time of the booking
                status: booking.status,
                note: booking.note,
            }
        )

        if(!bookingSlot) throw new Error("booking did not register.")

            return bookingSlot
    } catch (error) {
        console.log(error)
    }
}


export async function deleteBooking(bookingId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.bookingCollectionId,
            bookingId,
        )

        if(!statusCode) throw new Error("Delete booking did not register.")

            return { status: "ok" }
    } catch (error) {
        console.log(error)
    }
}


// CHAT SECTION

export async function initiateChat(senderId: string, receiverId: string) {
    // Step 1: Check if a chat exists between sender and receiver
    const existingChats = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        [
            Query.contains('chatters', [senderId]),
            Query.contains('chatters', [receiverId])
        ]
    );

    console.log("existingChats:", existingChats);
    let chatId;
    if (existingChats.total === 0) {
        // Step 2: Create a new chat if not found
        const newChat = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.chatsCollectionId,
            ID.unique(),
            {
                participants: [senderId, receiverId],
                chatters: [senderId, receiverId],
                lastMessageId: '',
                lastUpdated: new Date().toISOString()
            }
        );

        chatId = newChat.$id;
        // console.log("chatId::", chatId);

        // Step 3: Perform backend operations asynchronously
        (async () => {
            // Step 3.1: Update UserChats entries for each participant
            const senderUserChatsList = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userChatsCollectionId,
                [Query.equal('user', senderId)]
            );
            // console.log("senderUserChatsList:", senderUserChatsList);

            const receiverUserChatsList = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userChatsCollectionId,
                [Query.equal('user', receiverId)]
            );
            // console.log("receiverUserChatsList:", receiverUserChatsList);

            if (senderUserChatsList.total === 0 || receiverUserChatsList.total === 0) {
                throw new Error("UserChats document not found for one or both users.");
            }

            const senderUserChats = senderUserChatsList.documents[0];
            const receiverUserChats = receiverUserChatsList.documents[0];

            const updatedSenderChats = senderUserChats.chats
                ? [...senderUserChats.chats.map(chat => chat.$id), chatId]
                : [chatId];
            const updatedReceiverChats = receiverUserChats.chats
                ? [...receiverUserChats.chats.map(chat => chat.$id), chatId]
                : [chatId];

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userChatsCollectionId,
                senderUserChats.$id,
                {
                    chats: updatedSenderChats,
                }
            );

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.userChatsCollectionId,
                receiverUserChats.$id,
                {
                    chats: updatedReceiverChats,
                }
            );
        })();
    } else {
        // Use the existing chat
        chatId = existingChats.documents[0].$id;
    }

    return chatId;
}

export async function getChatById(chatId: string) {

    if (!chatId) throw new Error("Chat ID is required")

    try {
        const chat = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.chatsCollectionId,
            chatId
        )

        if (!chat || Object.keys(chat).length === 0) {
            throw new Error("Chat not found.")
        }

        return chat
    } catch (error) {
        console.log(error)
    }
}


export async function getUserChats(userId: string) {
    const userChats = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userChatsCollectionId,
        [Query.equal("user", userId)]
    )

    if(!userChats) throw new Error("Failed to get user chats.")

    return userChats
}


export async function getUnseenMessagesCounts(chatIds: string[], userId: string) {
    const unseenMessagesCounts = await Promise.all(
        chatIds.map(async (chatId) => {
            const unseenMessages = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.messagesCollectionId,
                [
                    Query.equal("chatId", chatId),
                    Query.notEqual("seenBy", userId)
                ]
            );

            return {
                chatId,
                count: unseenMessages.total
            };
        })
    );

    return unseenMessagesCounts;
}

export async function createMessage(message: INewMessage, chatId: string, seenBy: string[]) {
    
    try {
        const newMessage = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.messagesCollectionId,
            ID.unique(),
            {
                body: message.body,
                timestamp: message.timestamp,
                senderId: message.senderId,
                chat: chatId,
                seenBy,
            }
        )

        const lastMessage = message.body
        await updateLastChatMessage(chatId, lastMessage)
        
        if(!newMessage) {
            throw new Error('Failed to send message')
        }


        return newMessage
    } catch (error) {
        console.error("Error sending a message:", error)
        throw new Error("Error sending a message:")
    }
    
}

export async function updateLastChatMessage(chatId: string, lastMessage: string) {
    try {
        const updateLastMessage = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.chatsCollectionId,
            chatId,
            {
                lastMessage: lastMessage,
            }
        )
        
        if(!updateLastMessage) throw new Error("Last message did not register.")

        return updateLastMessage
        
    } catch (error) {
        throw new Error("Error updating a message:")
    }
}

export async function getChatMessages(chatId: string, limit = 20, offset = 0) {
    const chatsMessages = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.messagesCollectionId,
        [
            Query.equal("chat", chatId),
            Query.orderDesc("$createdAt"),
            Query.limit(limit),
            Query.offset(offset)
        ]
    );

    if (!chatsMessages || chatsMessages.documents.length === 0) {
        throw new Error("Failed to get chat messages.");
    }

    return chatsMessages.documents;
}

export async function deleteMessage(messageId: string){
    try {
        const statusCode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.messagesCollectionId,
        messageId,
        )

        if(!statusCode) throw new Error("Delete message did not register.")

        return { status: "ok" }

    } catch (error) {
        console.error(error)
        throw new Error ("Error deleting the message")
    }
}

export async function getInfiniteMessages({ pageParam }: {pageParam: number}) {
    const queries : any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)]

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const messages = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.messagesCollectionId,
            queries
        )
        
        if(!messages) throw new Error("No messages found")
            
            return messages
        } catch (error) {
            console.log(error)
        }
} // not used


