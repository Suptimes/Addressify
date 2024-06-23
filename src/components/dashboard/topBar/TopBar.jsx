import { Link } from "react-router-dom"
import { useUserContext } from "../../../context/AuthContext"

const TopBar = () => {
    const { user } = useUserContext()

    return (
        <div className="fixed flex top-0 left-0 md:flex md:fixed items-center justify-between px-5 py-5 w-full h-[60px] z-10 bg-white shadow">
            <div className="left flex gap-5 items-center justify-center">
            <Link to="" className="logo flex gap-5 items-center justify-center font-bold">
                <img src="/logo-addressify.png" height={45} width={45} alt="addressify" />
                <span>addressify</span>
            </Link>
            </div>

            <div className="right flex items-center justify-between">
                <Link to={`/profile/${user.id}`} className="user flex items-center justify-between gap-5 font-semibold">
                    <img src={user.imageUrl || "/icons/profile-placeholder.svg"} alt="profile image" className="rounded-full shadow-md coloredIcon" height={35} width={35} />
                    {/* REMEMBER ONLY FIRST NAME IN LG SCREENS */}
                    <span className="userName hidden md:block">{user.name || ""}</span>
                </Link>
            </div>
        </div>
    )
}

export default TopBar
