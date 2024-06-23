import { getCurrentUser } from '@/lib/appwrite/api'
import { IUser } from '@/types'
import { createContext, useContext, useEffect, useState} from 'react'

export const INITIAL_USER: IUser = {
    id: "", 
    name: "",
    email: "",
    imageUrl:""
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: true,
    isAuthd: false,
    isAuthenticated: false,
    setUser: (() => {}) as React.Dispatch<React.SetStateAction<IUser>>,
    setIsAuthenticated: (() => {}) as React.Dispatch<React.SetStateAction<boolean>>,
    checkAuthUser: async () => false as boolean,
}

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: {children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthd, setIsAuthd] = useState(
        localStorage.getItem('isAuthd') === 'true'
      );

    const checkAuthUser = async () => {
        try {
            setIsLoading(true)
            const currentAccount = await getCurrentUser()

            if(currentAccount) {
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                })

                setIsAuthenticated(true)
                setIsAuthd(true)
                localStorage.setItem('isAuthd', 'true')
                return true
            }

            return false
        } catch (error) {
            console.log(error)
            setIsAuthd(false)
            localStorage.setItem('isAuthd', 'false')
            return false
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const cookieFallback = localStorage.getItem("cookieFallback")
        if (cookieFallback === '[]' || cookieFallback === null) {
          setIsAuthenticated(false)
          localStorage.setItem('isAuthd', 'false')
          setIsLoading(false)
        } else {
          checkAuthUser()
        }
      }, [])
    

    const value = {
        user,
        setUser,
        isLoading,
        isAuthd,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)
