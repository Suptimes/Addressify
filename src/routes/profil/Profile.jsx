import List from "../../components/list/List"
import Chat from "../../components/chat/Chat"
import "./profile.scss"
import { useSignOutAccount } from "../../lib/react-query/queriesAndMutations"
import { useEffect, useState } from "react"


const Profile = () => {


  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const [redirect, setRedirect] = useState(false);
  
  useEffect(() => {
    if (isSuccess) {
      setRedirect(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (redirect) {
      window.location.href = "./";
    }
  }, [redirect]);


  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Info</h1>
            <div className="flex butbut">
              <button>Update Profile</button>
              <button className="signout" onClick={() => signOut()}>Sign Out</button>
            </div>
          </div>
          <div className="info">
            <div className="imgPro"><img src="../../../public/accountImg.jpg" alt="" /></div>
            <div className="infoText">
              <span>Username: <b>Hassan Anibou</b></span>
              <span>Email: <b>Hassan@gmail.com</b></span>
            </div>
          </div>

          <div className="title">
            <h1>My Listings</h1>
            <button>Create New Listing</button>
          </div>
          <List />
            
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List />
        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          <Chat />
        </div>
      </div>
    
    </div>
  )
}

export default Profile
