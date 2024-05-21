import { useState } from "react"
import FormInput from "../../components/formInput/FormInput"
import "./signUp.scss"
import { Link } from "react-router-dom"
import { createUserAccount } from "../../lib/appwrite/api"
import { Button } from "@/components/ui/button"


const SignUp = () => {

  const [ values, setValues ] = useState({
    firstName: "",
    lastName: "",
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
      pattern: `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ){8,20}$`,
      // pattern: "/^(?=(.*[A-Z]){1})(?=(.*[a-z]){1})(?=(.*[0-9]){1})(?=(.*[@#$%^!&+=.\-_*]){2})([a-zA-Z0-9@#$%^!&+=*.\-_]){8,20}$/",
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
      // required: true
    },
  ]


  async function handleSubmit (e) {
    e.preventDefault()
    const newUser = await createUserAccount(values)

    if(!newUser) {
      return
    }
  }

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }


  return (
    <div className="page">
      <div className="form">
        <img src="logo-addressify.png" />
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
          <button onSubmit={handleSubmit}>Sign up</button>
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
