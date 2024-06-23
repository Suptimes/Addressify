import {ID, ImageGravity, Query} from "appwrite"
import { account, appwriteConfig, avatars, databases, storage } from "./config"
import { INewPost, INewUser, IUpdatePost } from "@/types"
import { useUserContext } from "@/context/AuthContext"


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
    imageUrl?: URL; // maybe change it to string because its stored in DB
    username?: string;
}) {

    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
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
        const session = await account.deleteSession("current");
        localStorage.setItem('isAuthd', 'false')
        return session
    } catch (error) {
        console.log(error)
    }
}

export async function createPost (post: INewPost) {
    try{
        // Upload image to storage
        const uploadedFile = await uploadFile(post.file[0])
        // Quick check
        if(!uploadedFile) throw new Error('File upload failed')

        // Get file URL
        const fileUrl = await getFilePreview(uploadedFile.$id)

        if(!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw new Error('Failed to generate file URL')
        }
        if (typeof fileUrl !== 'string' || fileUrl.length > 2000) {
            await deleteFile(uploadedFile.$id);
            throw new Error('Invalid file URL');
        }
        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            ID.unique(),
            {
                owner: post.userId,
                title: post.title,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                price: post.price,
                description: post.description,
            }
        )

        if(!newPost) {
            await deleteFile(uploadedFile.$id)
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
            2000,
            2000,
            ImageGravity.Center,
            100,
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
    const hasFileToUpdate = post.file.length > 0
    
    try{
        // Fetch the current user to validate ownership
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error("Unable to retrieve current user");
        }

        console.log("CurrentUserr:", currentUser)

         // Fetch the existing post to validate the owner
         const existingPost = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            post.postId
        );

        console.log("Existing Postt:", existingPost)

        if (!existingPost) {
            throw new Error("Post not found");
        }

        // Check if the logged-in user is the owner of the post
        if (existingPost.owner.accountId !== currentUser.accountId) {
            throw new Error("You are not authorized to edit this post");
        }


        let image = {
            imageUrl: post.imageUrl, //.toString()
            imageId: post.imageId,
        }

        if(hasFileToUpdate) {
            // Upload image to storage
            const uploadedFile = await uploadFile(post.file[0])
            // Quick check
            if(!uploadedFile) throw new Error('File upload failed')

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


        // Update post in the database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.propertyCollectionId,
            post.postId,
            {
                title: post.title,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                price: post.price,
                description: post.description,
            }
        )

        if(!updatedPost) {
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            throw new Error('Failed to update document')
        }

        // Delete the old image if a new one was uploaded successfully
        if (hasFileToUpdate && post.imageId && post.imageId !== image.imageId) {
            await deleteFile(post.imageId);
        }

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