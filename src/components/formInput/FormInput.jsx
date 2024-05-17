import { useState } from "react"
import "./formInput.scss"


const FormInput = (props) => {
    const { errorMessage, label, onChange, id, ...inputProps } = props
    const [focused, setFocused] = useState(false)

    const handleFocus = (e) => {
        setFocused(true)
    }

  return (
    <div className="formInput">
      {/* <label>First Name</label>  */}

      <input 
        {...inputProps} 
        onChange={onChange} 
        onBlur={handleFocus} 
        onFocus={()=>
            inputProps.name === "confirmPassword" && setFocused(true)}
        focused={focused.toString()}
    />
      <span className="errorMsg">{errorMessage}</span>
    </div>
  )
}

export default FormInput
