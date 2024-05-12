import List from "../../components/list/List"
import Chat from "../../components/chat/Chat"
import "./profile.scss"

const Profile = () => {
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Info</h1>
            <button>Update Profile</button>
          </div>
          <div className="info">
            <span>Picture: <img src="https://scontent.ffjr1-5.fna.fbcdn.net/v/t1.6435-1/67770793_10219891316415996_7156740147474595840_n.jpg?stp=dst-jpg_p200x200&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_bpabUbFbh4Q7kNvgFjC-bc&_nc_ht=scontent.ffjr1-5.fna&oh=00_AfAfRKaiF6jlsYgwRBp2e8WnhAgop6JNTMrei7fK8O8l-Q&oe=6662F7F4" alt="" /></span>
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
