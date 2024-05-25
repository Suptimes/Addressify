import {
    useQuery, //for fetching data
    useMutation, //for modifying data
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query"
import { createUserAccount, signInAccount } from "../appwrite/api"
import { INewUser } from "@/types"


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}
// export const useCreateUserAccount = () => {
//     return useMutation((user: INewUser) => createUserAccount(user));
// };

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string; 
            password: string;
        }) => signInAccount(user)
    })
}

// export const useSignInAccount = () => {
//     return useMutation((user: { email: string; password: string }) => signInAccount(user));
// };