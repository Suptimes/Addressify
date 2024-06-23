import { bottombarLinks } from "@/constants"
import { Link, useLocation } from "react-router-dom"
import "./bottombar.scss"

const BottomBar = () => {
    const { pathname } = useLocation()

    return (
        <section className='bottom-bar'>
            {bottombarLinks.map((link) => {
            const isActive = pathname === link.route

            return(
                <Link 
                to={link.route}
                key={link.label} 
                className=
                 {`group flex flex-col justify-center items-center gap-2 h-[90px] w-[120px] rounded-md text-black hover:text-white text-[12px] font-medium leading-[140%] bg-[#f4ecfb] hover:bg-purple-600 active:bg-purple-700 transition ease-in-out ${isActive && "bg-purple-600 text-white"}`}
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:brightness-200 ${!isActive && "coloredIcon"} ${isActive && "brightness-200"} `}
                    height={40}
                    width={40}
                  />
                  {link.label}
                </Link>
            )
          })}
        </section>
    )
}

export default BottomBar
