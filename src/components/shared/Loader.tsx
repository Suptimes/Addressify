
const Loader = ({ h = 21, w = 21, brightness = "", hover = "" }) => {
  return (
    <div className={`${brightness} group-${hover} justify-center items-center`}>
      <img 
        src="/loader.svg" 
        alt="loader"
        className="my-[-5px]"
        height={h}
        width={w}
      />
    </div>
  )
}

export default Loader
