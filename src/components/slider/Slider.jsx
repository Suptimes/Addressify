import { useState } from "react"
import "./slider.scss"
import { X } from "lucide-react"

const Slider = ({ images }) => {
    const [imageIndex, setImageIndex] = useState(null)

    const changeSlide = (direction) => {
        
        direction === "left"
            ? imageIndex === 0 
                ? setImageIndex(images.length-1)
                : setImageIndex(imageIndex-1)
            
            : imageIndex === images.length-1
                ? setImageIndex(0)
                : setImageIndex(imageIndex+1)

    }

  return (
    <div className="slider">
        {
        imageIndex !== null && 
        <div className="fullSlider">
            <div className="arrow" onClick={()=>changeSlide("left")}>
                <img src="/arrow.png" alt="arrow" />
            </div>
            <div className="imgContainer">
                <img src={images[imageIndex]} alt="" />
            </div>
            <div className="arrow" onClick={()=>changeSlide("right")}>
                <img src="/arrow.png" className="right" alt="arrow" />
            </div>
            <div className="close" onClick={()=>setImageIndex(null)}>
                < X size={36} />
            </div>
        </div>
        }



        <div className="bigImage">
            <img src={images[0]} alt="" onClick={()=>(setImageIndex(0))}/>
        </div>
        <div className="smallImages">
            {images.slice(1).map((image, index)=>(
                <img src={image} alt="Property image" key={index} onClick={()=>(setImageIndex(index+1))} />
            ))}
        </div>
    </div>
  )
}

export default Slider
