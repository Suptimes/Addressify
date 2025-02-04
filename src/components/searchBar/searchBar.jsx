import "./searchBar.scss"
import { useState } from "react"

const types = ["buy", "rent"]

const SearchBar = () => {
    const [select, setSelect] = useState({
        type:"buy",
        location: "",
        minPrice:0,
        maxPrice:0,
})

const switchType = (val) => {
    setSelect((prev) => ({...prev, type: val}))
}

  return (
    <div className="searchBar">
        <div className="choice">
            <div className="type">
                {types.map((type)=>(
                <button 
                    key={type} 
                    onClick={()=>switchType(type)}
                    className={select.type === type ? "active" : ""}
                >
                    {type}
                </button>
                ))}
            </div>
        </div>
        <form>
            <div className="inputContainer">
                <input  type="text" name="location" placeholder="City or Region" />
                {/* <input  type="number" min={0} max={99999999} name="minPrice" placeholder="Min Price"/>
                <input  type="number" min={0} max={99999999} name="maxPrice" placeholder="Max Price"/> */}
                <button className="btnLarge flex items-center justify-center">
                    <img className="brightness-200" src="/icons/search.svg" alt="" />
                </button>
                <img className="btnSmall" src="/searchLarge.png" alt="" />
            </div>
        </form>
      
    </div>
  )
}

export default SearchBar
