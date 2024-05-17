import SearchBar from "../../components/searchBar/searchBar"
import "./homePage.scss"

const HomePage = () => {
  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          {/* <h1 className="title">Find Your New Address & Save On Comissions</h1> */}
          <h1 className="title">no middle-men. <br />no commission. <br/>no hassle.</h1>
          <p>
            Revolutionizing real estate: Own or rent your dream property directly. Experience real estate on your terms.
          </p>

          <SearchBar />

          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
          
            <div className="box">
              <h1>200</h1>
              <h2>Awards Gained</h2>
            </div>
          
            <div className="box">
              <h1>1200+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>

      
      <div className="imgContainer">
        <img src="/bg.png" alt="background image" />
      </div>
    </div>
  )
}

export default HomePage
