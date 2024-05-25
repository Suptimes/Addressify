import { Link } from "react-router-dom"
import FormInput from "../../components/formInput/FormInput"
import "../signUp/signUp.scss"

const SignIn = () => {
  return (
    <div className="page">
      <div className="form">
        <img className="logoForm" src="logo-addressify.png" />
        <h2>Log in to your account</h2>
        <p>Please enter your details to continue</p>
        <form >
          <FormInput placeholder="Email"/>
          <FormInput placeholder="Password"/>
          <button>Log in</button>
          <p className="already">Don't have an account? <Link to="/signup"><span>Sign up</span></Link></p>
        </form>
      </div>

      <div className="background">
          <img src="/bg.png" alt="" />
      </div>
    </div>
  )
}

export default SignIn
