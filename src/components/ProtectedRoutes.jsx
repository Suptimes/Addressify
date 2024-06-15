import { useEffect, useState } from "react"
import { useUserContext } from "../context/AuthContext"
import Loader from "./shared/Loader"
import { useNavigate } from "react-router-dom"

const ProtectedRoutes = ({ children }) => {
    
    const { checkAuthUser, isLoading, isAuthd } = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !isAuthd) {
            navigate("/signin");
        }else if (isLoading) {
            checkAuthUser();
        }
      }, [isLoading, isAuthd, navigate, checkAuthUser]);
    

      if (isLoading) {
        return <div className="flex items-center justify-center gap-2"><Loader/> Loading...</div>;
      }

  return children
}

export default ProtectedRoutes
