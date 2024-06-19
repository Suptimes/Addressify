import HomePage from "./routes/homePage/homePage"
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/singlePage";
import Profile from "./routes/profil/Profile";
import SignUp from "./routes/signUp/SignUp";
import SignIn from "./routes/signIn/SignIn";
import Dashboard from "./routes/dashboard/Dashboard";
import Explore from "./routes/dashboard/explore/Explore.jsx"
import Saved from "./routes/dashboard/saved/Saved.jsx"
import Messages from "./routes/dashboard/messages/Messages.jsx"
import Properties from "./routes/dashboard/properties/Properties.jsx"
import CreatePost from "./routes/dashboard/createPost/CreatePost.jsx"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import ProtectedRoutes from './components/ProtectedRoutes'


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
        },
        ,{
          path:"/signup",
          element:<SignUp />
        },{
          path:"/signin",
          element:<SignIn />
        },{
          
          path: "/profile",
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
        }
      ]
    },
  ]);

  return (
    <>
      <RouterProvider router={router}/>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  )
}

export default App