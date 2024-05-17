import SignUp from "../signUp/SignUp"
import SignIn from "../signim/SignIn"
import "./login.scss"


const Login = () => {

  const isRegistered = false

  return (
    <div>
      {isRegistered 
        ? <SignIn />
        : <SignUp />
      }
    </div>
  )
}

export default Login
