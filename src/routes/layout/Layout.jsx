import "./layout.scss"
import Navbar from "../../components/navbar/Navbar"
import { Outlet, useLocation } from "react-router-dom"
import LeftSideBar from "../../components/dashboard/sidebar/LeftSideBar"
import TopBar from "../../components/dashboard/topBar/TopBar"
import BottomBar from "../../components/dashboard/bottomBar/BottomBar"

const Layout = () => {
  const location = useLocation()
  const noNavbarRoutes = [
    /^\/dashboard$/,
    /^\/explore$/,
    /^\/messages\/[a-zA-Z0-9-]+$/,
    /^\/saved$/,
    /^\/properties$/,
    /^\/create-post$/,
    /^\/edit-post\/[a-zA-Z0-9-]+$/, // For trailing slashes ^\/edit-post\/\d+\/?$
    /^\/edit-profile\/[a-zA-Z0-9-]+$/, 
    /^\/profile\/[a-zA-Z0-9-]+$/,
  ];

  // Check if the current path matches any of the noNavbarRoutes
  const hideNavbar = noNavbarRoutes.some(route => route.test(location.pathname));

  return (
    <>
      <div className="layout">
        {hideNavbar && (
          <div>
            <div>
              <TopBar />
            </div>
            <div>
              <LeftSideBar />
            </div>
            <div>
              <BottomBar />
            </div>
          </div>
        )}
        {!hideNavbar && (
          <div className="navbar bg-white">
            <Navbar />
          </div>
        )}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout
