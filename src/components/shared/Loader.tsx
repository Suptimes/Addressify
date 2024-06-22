
const Loader = ({ h, w }) => {
  return (
    <div className="justify-center items-center">
      <img 
        src="/loader.svg" 
        alt="loader"
        className="my-[-5px]"
        height={h || 21}
        width={w || 21}
      />
    </div>
  )
}

export default Loader
