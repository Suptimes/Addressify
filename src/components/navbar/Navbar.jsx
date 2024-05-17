import { useState } from "react"
import { Link } from "react-router-dom"
import "./navbar.scss"


const Navbar = () => {
  const [open, setOpen] = useState(false)

  const user = false;

  return (
    <nav>
        <div className="left">
          <Link to="" className="logo">
            <img className="address" src="/logo-addressify.png" alt="" />
            <span>addressify</span>
          </Link>
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/list">eServices</Link>
            <Link to="/1">Contact</Link>
            <Link to="/">Pricing</Link>
          </div>
        </div>
        <div className="right">
          {user 
            ? (
              <div className="user">
                <img src="https://scontent.ffjr1-5.fna.fbcdn.net/v/t1.6435-1/67770793_10219891316415996_7156740147474595840_n.jpg?stp=dst-jpg_p200x200&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_bpabUbFbh4Q7kNvgFjC-bc&_nc_ht=scontent.ffjr1-5.fna&oh=00_AfAfRKaiF6jlsYgwRBp2e8WnhAgop6JNTMrei7fK8O8l-Q&oe=6662F7F4" alt="" />
                {/* REMEMBER ONLY FIRST NAME IN LG SCREENS */}
                <span className="userName">Hassan Anibou</span>
                <Link to="/profile" className="profile">
                  <div className="notification">3</div>
                  <span>Profile</span>
                </Link>
              </div>
              )
            : (
              <div className="Sign">
                <Link to="/signin">Sign&nbsp;in</Link>
                <Link to="/signup" className="register">Sign&nbsp;up</Link>
              </div>
            )
            
          }
          
          <div className="menuIcon">
            <img src={open ? "/menu.png" : "/menu-new.png"} alt="" onClick={()=>setOpen((prev)=> !prev)} />
          </div>
          <div className={open ? "menu active" : "menu"}>
            <Link to="/">Home</Link>
            <Link to="/">eServices</Link>
            <Link to="/">Pricing</Link>
            <Link to="/">Sign in</Link>
            <Link to="/signup">Sign up</Link>
          </div>

        </div>
    </nav>
  )
}

export default Navbar
