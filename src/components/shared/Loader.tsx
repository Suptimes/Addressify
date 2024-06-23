
const Loader = ({ h = 21, w = 21 }) => {
  return (
    <div className="justify-center items-center">
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
