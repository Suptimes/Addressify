import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import FormInput from "../../components/formInput/FormInput"
import "./signUp.scss"
// import { createUserAccount, signInAccount } from "../../lib/appwrite/api"
import Loader from "../../components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { useCreateUserAccount, useSignInAccount } from "../../lib/react-query/queriesAndMutations"
import { useUserContext } from "../../context/AuthContext"


const SignUp = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate()

  // Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount()

  const [ values, setValues ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const inputs = [
    {
      id:1,
      name: "name",
      type: "text",
      placeholder: "Name",
      errorMessage: "Name should be 2-16 characters & shouldn't include special characters!",
      label: "First Name",
      pattern: "^[A-Za-z0-9]{2,30}$",
      required: true
    },
    // {
    //   id:2,
    //   name: "lastName",
    //   type: "text",
    //   placeholder: "Last Name",
    //   errorMessage: "Name should be 2-16 characters & shouldn't include special characters!",
    //   label: "Last Name",
    //   pattern: "^[A-Za-z0-9]{2,30}$",
    //   // required: true
    // },
    {
      id:3,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "Email should be a valid email address!",
      label: "Email",
      required: true
    },
    {
      id:4,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage: "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ){8,20}$`,
      required: true
    },
    {
      id:5,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      label: "Confirm Password",
      pattern: values.password,
      required: true
    },
  ]

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }


  async function handleSubmit (e) {
    e.preventDefault()

    // if (values.password !== values.confirmPassword) {
    //   return toast({ title: "Passwords don't match." });
    // }

    try {
      const newUser = await createUserAccount(values);

      if (!newUser) {
        return toast({ title: "Sign up failed. Please try again." });
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        return toast({ title: "Sign in failed. Please try again." });
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        // setValues({ name: "", email: "", password: "", confirmPassword: "" });
        navigate('./')
      } else {
        toast({ title: "Sign in failed. Please try again." });
      }
    } catch (error) {
      console.log(error);
      toast({ title: "An error occurred. Please try again." });
    }
    
    // try{
    //   const newUser = await createUserAccount(values)
  
    //   if(!newUser) {
    //     return toast({ title: "Sign up failed. Please try again."})
    //   }

    //   window.location.href = './'

    // } catch (error) {
    //   console.log(error)
    // }

    // const session = await signInAccount({
    //   email: values.email,
    //   password: values.password
    // })

    // if(!session) {
    //   return toast({title: "Login failed. Please try again."})
    // } else {
    //   window.location.href = './'
    // }


    // const isLoggedIn = await checkAuthUser()
    
    // if(isLoggedIn){
    //   form.reset()

    //   window.location.href = './'
    //   {/*navigate("./")*/}
    // } else {
    //   return toast({title: "Sign in failed. Please try again."})
    // }
  }



  

  return (
    <div className="page">
      <div className="form">
        <img className="logoForm" src="logo-addressify.png" />
        <h2>Create a new account</h2>
        <p>Please enter your details to continue</p>
        <form onSubmit={handleSubmit}>
          {inputs.map((input)=>(
            <FormInput 
              key={input.id}
              {...input} 
              value={values[input.name]} 
              onChange={onChange} 
            />
          ))}
          <button type="submit" disabled={isCreatingAccount}>
            {isCreatingAccount ? (
              <div className="loader"><Loader/> Loading...</div>
            ) : "Sign up"}
            {/* Sign up */}
            </button>
          <p className="already">Already have an account? <Link to="/signin"><span>Log in</span></Link></p>
        </form>
      </div>

      <div className="background">
          <img src="/bg.png" alt="" />
      </div>
    </div>
  )
}

export default SignUp
