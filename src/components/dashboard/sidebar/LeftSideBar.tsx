import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "../../../context/AuthContext"
import "../sidebar/leftSideBar.scss"
import { sidebarLinks } from "@/constants"
import { INavLink } from "@/types"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import Loader from "@/components/shared/Loader"

const LeftSideBar = () => {
  // const { user } = useUserContext()
  const { pathname } = useLocation()
  const { mutate: signOut, isSuccess, isPending: isLoggingOut } = useSignOutAccount()
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate()
  
  useEffect(() => {
    if (isSuccess) {
      setRedirect(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (redirect) {
      navigate("./")
      toast({ title: "Logged out." })
    }
  }, [redirect]);

  return (
    <nav className="leftsidebarr hidden md:flex px-3 pt-10 pb-3 flex-col justify-between min-w-[270px]">
      
      <div className="insidecont custom-scrollbar flex mt-[-20px] flex-col gap-6 w-full">

        <ul className="list-none flex flex-col gap-3">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route

            return(
              <li key={link.label} className=
              {`li group py-1 rounded-md text-black hover:text-white text-[16px] font-medium leading-[140%] bg-[#f4ecfb] hover:bg-purple-600 active:bg-purple-700 transition ease-in-out ${isActive && "bg-purple-600 text-white"}`}>
                <NavLink 
                to={link.route}
                className="flex gap-4 items-center p-4"
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:brightness-200 ${!isActive &&"coloredIcon"} ${isActive && "brightness-200"} `}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="w-full flex group">
        <div 
          className="p-4 w-full flex justify-start rounded-md text-black hover:text-white text-[16px] font-medium leading-[140%] bg-[#f4ecfb] hover:bg-[#f61414] active:bg-[#be1515] transition cursor-pointer"
          onClick={() => signOut()}
        >
          <img 
            src="/icons/logout.svg"
            className="mr-4 group-hover:brightness-200 coloredIcon transition"
          />
          {isLoggingOut ?
            <div className="flex brightness-50 group-hover:brightness-200 items-center justify-start gap-2"><Loader /> Signing out...</div> 
            : "Sign out"}
        </div>
      </div>
    </nav>
  )
}

export default LeftSideBar
