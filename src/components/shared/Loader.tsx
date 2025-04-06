
const Loader = ({ h = 21, w = 21, brightness = "", hover = "", height = "" }) => {
  return (
    <div className={`${brightness} group-${hover} ${height} justify-center items-center`}>
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
