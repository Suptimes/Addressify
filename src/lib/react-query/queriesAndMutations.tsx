import {
    useQuery, //for fetching data
    useMutation, //for modifying data
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query"
import { createAvailability, createBooking, createMessage, createPost, createUserAccount, deletePost, deleteSavedPost, getAvailabilitiesByPropertyId, getChatById, getChatMessages, getCurrentUser, getInfiniteMessages, getInfinitePosts, getPostById, getRecentPosts, getSaveById, getSavesByIds, getUnseenMessagesCounts, getUserById, getUserChats, initiateChat, likePost, savePost, searchPosts, signInAccount, signOutAccount, toggleBlockUser, updatePost, updateProfile } from "../appwrite/api"
import { IMessage, INewAvailability, INewBooking, INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
import { QUERY_KEYS } from "./queryKeys"
import { useCallback } from "react"


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string; 
            password: string;
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}


export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}


export const useLikePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, likesArray }: {postId: string, likesArray: string[] }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


export const useSavePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, userId }: {postId: string, userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery ({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}


export const useGetPostById = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: async () => { 
            if (!postId) throw new Error("Post ID is required")
            return getPostById(postId)
        },
        enabled: !!postId,
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}


export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage) => {
          if(lastPage && lastPage.documents.length === 0) return null
          
          const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id

          return lastId
        }
    })
    
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}


export const useGetSaveById = (saveId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVE_BY_ID, saveId],
        queryFn: async () => { 
            if (!saveId) throw new Error("Save ID is required")
            return getSaveById(saveId)
        },
        enabled: !!saveId,
    })
}


export const useGetUserById = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: async () => { 
            if (!userId) throw new Error("User ID is required")
            return getUserById(userId)
        },
        enabled: !!userId,
    })
}


export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (user: IUpdateUser) => updateProfile(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data.$id],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
        onError: (error) => {
            console.error('Error updating profile:', error);
        },
    })
}

export const useGetSavedPosts = (postIds: string[]) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVES_BY_ID, postIds],
        queryFn: async () => { 
            if (!postIds) throw new Error("Saves IDs are required")
            return getSavesByIds(postIds)
        },
        enabled: !!postIds && postIds.length > 0,
    });
}

// BOOKING SECTION

export const useCreateAvailability = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (avail: INewAvailability) => createAvailability(avail),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_AVAIL]
            })
        }
    })
}

export const useCreateBooking = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (booking: INewBooking) => createBooking(booking),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_BOOKING]
            })
        }
    })
}

export const useGetAvailByPropId = (propId?: string) => {
    return useQuery({
        queryKey: ['GET_AVAIL_BY_PROP_ID', propId],
        queryFn: async () => { 
            if (!propId) throw new Error("Property ID is required");
            return getAvailabilitiesByPropertyId(propId);
        },
        enabled: !!propId, // Only run if propId is provided
        retry: false, // Disable retry if you want immediate error feedback
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

// CHAT SECTION

export const useInitiateChat = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation(initiateChat, {
      onSuccess: (chatId: string, { senderId, receiverId }) => {
        // Update the cache with the new or fetched chat
        queryClient.setQueryData(['chat', { senderId, receiverId }], chatId);
        queryClient.invalidateQueries(['userChats', senderId]);
        queryClient.invalidateQueries(['userChats', receiverId]);
      },
      onError: (error: any) => {
        console.error('Error initiating chat:', error);
      }
    });
  
    const initiate = useCallback((senderId: string, receiverId: string) => {
      return mutation.mutateAsync({ senderId, receiverId });
    }, [mutation]);
  
    return {
      initiate,
      isLoading: mutation.isPending,
      isError: mutation.isError,
      data: mutation.data,
      error: mutation.error,
    };
}

export const useGetChatById = (chatId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CHAT_BY_ID, chatId],
        queryFn: async () => { 
            if (!chatId) throw new Error("Chat ID is required")
            return getChatById(chatId)
        },
        enabled: !!chatId,
    })
}


export const useGetUserChats = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERCHATS, userId],
        queryFn: () => getUserChats(userId),
        enabled: !!userId, // Ensures the query runs only when userId is available
    })
}

export const useGetUnseenMessagesCounts = (chatIds: string[], userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_UNSEEN_MESSAGES_COUNT, chatIds, userId],
        queryFn: () => getUnseenMessagesCounts(chatIds, userId),
        enabled: chatIds.length > 0 && !!userId,
    })
}

export const useCreateMessage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({message, chatId, seenBy, lastMessageSender}) => createMessage(message, chatId, seenBy, lastMessageSender),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES]
            })
        }
    })
}


export const useGetChatMessages = (chatId: string, limit = 20, offset = 0) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CHAT_MESSAGES, chatId],
        queryFn: () => getChatMessages(chatId, limit, offset),
        enabled: !!chatId,  // Ensure the query runs only when chatId is available
    });
}

export const useGetInfiniteMessages = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_MESSAGES],
        queryFn: getInfiniteMessages,
        getNextPageParam: (lastPage) => {
          if(lastPage && lastPage.documents.length === 0) return null
          
          const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id

          return lastId
        }
    })
    
}

export const useBlockUser = (setReceiverBlocked) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, blockedUser }) => toggleBlockUser(userId, blockedUser),
        onSuccess: (_, { blockedUser }) => {
            queryClient.invalidateQueries([QUERY_KEYS.GET_BLOCKED_USERS]);
            if (setReceiverBlocked) {
                setReceiverBlocked((prev) => !prev);
            }
        }
    });
}