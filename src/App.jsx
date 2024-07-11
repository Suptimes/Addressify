import HomePage from "./routes/homePage/homePage"
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/singlePage";
import Profile from "./routes/profil/Profile";
import SignUp from "./routes/signUp/SignUp";
import SignIn from "./routes/signIn/SignIn";
import Dashboard from "./routes/dashboard/Dashboard";
import Explore from "./routes/dashboard/explore/Explore.tsx"
import Unauthorized from "./routes/unauthorized/Unauthorized.tsx"
import EditPost from "./routes/dashboard/editPost/EditPost.tsx"
import EditProfile from "./routes/dashboard/editProfile/EditProfile.tsx"
import Saved from "./routes/dashboard/saved/Saved.tsx"
import Messages from "./routes/dashboard/messages/Messages.tsx"
import Properties from "./routes/dashboard/properties/Properties.tsx"
import CreatePost from "./routes/dashboard/createPost/CreatePost.jsx"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import ProtectedRoutes from './components/ProtectedRoutes'
import PublicRoutes from "./components/PublicRoutes.jsx";


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/list",
          element:<ListPage/>
        },
        {
          path:"/property/:id",
          element:<SinglePage/>
        },{
        },
        {
          path:"/unauthorized",
          element:<Unauthorized />
        },{
          path: "/signup",
          element: (
            <PublicRoutes>
              <SignUp />
            </PublicRoutes>
          ),
        },
        {
          path: "/signin",
          element: (
            <PublicRoutes>
              <SignIn />
            </PublicRoutes>
          ),
        },{
          
          path: "/profile/:id",
          element: (
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/explore",
          element: (
            <ProtectedRoutes>
              <Explore />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/messages",
          element: (
            <ProtectedRoutes>
              <Messages />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/create-post",
          element: (
            <ProtectedRoutes>
              <CreatePost />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/properties",
          element: (
            <ProtectedRoutes>
              <Properties />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/saved",
          element: (
            <ProtectedRoutes>
              <Saved />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/edit-post/:id",
          element: (
            <ProtectedRoutes>
              <EditPost />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/edit-profile/:id",
          element: (
            <ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>
          ),
        },
      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router}/>

      <Toaster />
    </>
  )
}

export default App