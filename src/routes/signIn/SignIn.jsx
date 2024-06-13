
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import FormInput from "../../components/formInput/FormInput"
import "../signUp/signUp.scss"
import Loader from "../../components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { useSignInAccount } from "../../lib/react-query/queriesAndMutations"
import { useUserContext } from "../../context/AuthContext"


const SignIn = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  // const navigate = useNavigate()

  // Queries
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount()

  const [ values, setValues ] = useState({
    email: "",
    password: "",
  })

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }


  async function handleSubmit (e) {
    e.preventDefault()

    try {
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        return toast({ title: "Sign up failed. Please try again." });
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        window.location.href = './profile'
      } else {
        toast({ title: "Sign up failed. Please try again." });
      }
    } catch (error) {
      console.log(error);
      toast({ title: "An error occurred. Please try again." });
    }
    
  }
  
  return (
    <div className="page">
      <div className="form">
        <img className="logoForm" src="logo-addressify.png" />
        <h2>Log in to your account</h2>
        <p>Please enter your details to continue</p>
        <form onSubmit={handleSubmit}>
          <FormInput placeholder="Email" name="email" onChange={onChange} />
          <FormInput placeholder="Password" name="password" onChange={onChange} />
          <button type="submit">
            {isSigningIn ? (
              <div className="loader"><Loader/> Loading...</div>
              ) : "Log in"}  
            </button>
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
