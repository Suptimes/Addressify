import HomePage from "./routes/homePage/homePage"
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/Layout";
import SinglePage from "./routes/singlePage/singlePage";
import Profile from "./routes/profil/Profile";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"

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
          path:"/:id",
          element:<SinglePage/>
        },
        {
          path:"/profile",
          element:<Profile />
        }
      ]
    },
  ]);

  return (
    <RouterProvider router={router}/>
  )
}

export default App