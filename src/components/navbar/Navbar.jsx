import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./navbar.scss"
import { useUserContext } from "../../context/AuthContext"


const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { checkAuthUser, isAuthenticated } = useUserContext()

  const user = isAuthenticated

  

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
            <Link to="/property/1">Contact</Link>
            <Link to="/">Pricing</Link>
          </div>
        </div>
        <div className="right">
          {user 
            ? (
              <div className="user">
                <img src="../../../public/accountImg.jpg" alt="" />
                {/* REMEMBER ONLY FIRST NAME IN LG SCREENS */}
                <span className="userName">Hassan Anibou</span>
                <Link to="/dashboard" className="profile">
                  <div className="notification">3</div>
                  <span>Dashboard</span>
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
