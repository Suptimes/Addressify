import "./profile.scss"
import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useUserContext } from "../../context/AuthContext"
import Loader from "../../components/shared/Loader"


const Profile = () => {


  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const [redirect, setRedirect] = useState(false);
  const { user, checkAuthUser, isLoading, isAuthd, isAuthenticated } = useUserContext()
  const navigate = useNavigate()


  useEffect(() => {
    if (isSuccess) {
      setRedirect(true)
    }
  }, [isSuccess])

  useEffect(() => {
    if (redirect) {
      navigate("./")
    }
  }, [redirect])


  // Fetch authentication status on mount
  // useEffect(() => {
  //   const fetchAuth = async () => {
  //     await checkAuthUser();
  //     setLoading(false);
  //   };
  //   fetchAuth();
  // }, [checkAuthUser]);

  // Redirect to sign-in if not authenticated
  // useEffect(() => {
  //   if (!isLoading && !isAuthd) {
  //     navigate("/signin");
  //   }
  // }, [isLoading, isAuthd, navigate]);

  return (
    <div className="middlePage max-lg:mt-[-6px]">
      <div className="w-full common-container-noscroll space-between max-md:flex-col">
        <div className="max-w-5xl flex-col flex-start gap-[40px] items-center justify-start w-full">
          <div className="max-w-5xl flex items-center justify-between w-full gap-3">
            <img 
            src="/icons/follow.svg"
            width={34}
            height={34} 
            alt="add" 
            className="brightness-0"/>
            <h1 className="h3-bold lg:h2-bold text-left w-full">Profile</h1>
            <div className="flex items-center justify-end gap-[10px] w-full">
              <button className="flex-center gap-2 py-[12px] px-[20px] bg-[#7209cb] text-white rounded-[12px] border-none shadow-[0_2px_4px_rgba(0,0,0,0.2)] cursor-pointer max-sm:p-4 max-sm:" 
                      onClick={()=>navigate(`/edit-profile/${user.id}`)}>
                        <img src="/icons/profile-edit.svg" width={20} height={20} className="whiteIcon" alt="" />
                        <p className="max-sm:text-sm text-[15px] max-xs:hidden">Update Profile</p>
              </button>

              {/* <button className="signout cursor-pointer" 
                      onClick={() => signOut()}>
                        Sign Out
              </button> */}
            </div>
          </div>

          <div className="flex justify-evenly items-center gap-[20px] w-full max-w-5xl max-sm:flex-col">

            <div className="flex p-[4px] rounded-full border-solid border-[4px] border-[#7209cb]">
              <img className="object-cover rounded-full w-[120px] h-[120px]" src={user.imageUrl || "/icons/profile-placeholder.svg"} alt="" />
            </div>

            <div className="flex flex-col items-start gap-[20px]">
              <span className="flex-center gap-[15px]">Name: <b>{user.name || "Happy user"}</b></span>
              <span className="flex-center gap-[15px]">Email: <b>{user.email || "email"}</b></span>
            </div>
          </div>

        </div>
      </div>

      {/* <div className="chatContainer">
        <div className="wrapper">
          <Chat />
        </div>
      </div> */}
    
    </div>
  )
}

export default Profile
