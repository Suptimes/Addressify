
import LeftSideBar from "../../components/dashboard/sidebar/LeftSideBar"
import "./dashboard.scss"


const Dashboard = () => {

  const isRegistered = false

  return (
    <div>
      <LeftSideBar/>

      {/* {isRegistered 
        ? <SignIn />
        : <SignUp /> */}
    </div>
  )
}

export default Dashboard
