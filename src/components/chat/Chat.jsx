import { useState } from "react"
import "./chat.scss"

const Chat = () => {

  const [chat, setChat] = useState(true)

  return (
    <div className="chat">
        <div className="messages">
            <h1>Messages</h1>
            <div className="message">
                <img src="/randaUser.png" alt="" />
                <span>Randa Afas</span>
                <p>Yes I will pay half price...</p>
            </div>

            {/* Multipe Message */}
            <div className="message">
                <img src="/randaUser.png" alt="" />
                <span>Randa Afas</span>
                <p>Open up the Door NOW</p>
            </div>
            <div className="message">
                <img src="/randaUser.png" alt="" />
                <span>Randa Afas</span>
                <p>Nice house, Do you shit in here too?</p>
            </div>
            <div className="message">
                <img src="/randaUser.png" alt="" />
                <span>Randa Afas</span>
                <p>I give 0 stars cuz why not</p>
            </div>
            <div className="message">
                <img src="/randaUser.png" alt="" />
                <span>Randa Afas</span>
                <p>I give 0 stars cuz why not</p>
            </div>
            <div className="message">
                <img src="/randaUser.png" alt="" />
                <span>Randa Afas</span>
                <p>I give 0 stars cuz why not</p>
            </div>
        </div>


        {chat && (<div className="chatBox">
            <div className="top">
                <div className="user">
                    <img src="/randaUser.png" alt="" />
                    Randa Afas
                </div>
                <span className="close" onClick={()=>setChat(null)}>X</span>
            </div>

            <div className="center">
                <div className="chatMessage">
                    <p>Hello, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage own">
                    <p>No, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage">
                    <p>No, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage">
                    <p>No, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage own">
                    <p>No, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage">
                    <p>No.</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage">
                    <p>No, I'm under the water.. I'm under the water I'm under the water I'm under the water</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage">
                    <p>No, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
                <div className="chatMessage">
                    <p>No, I'm under the water..</p> 
                    <span>1 hour ago</span>
                </div>
            </div>

            <div className="bottom">
                <textarea placeholder="Write message here" name="" id=""></textarea>
                <button>Send</button>
            </div>
        </div>
        )}
      
    </div>
  )
}

export default Chat
