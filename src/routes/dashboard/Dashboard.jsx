import "./dashboard.scss"
import MultiAvailabilityForm from "../../components/dashboard/MultiAvailabilityForm"

const Dashboard = () => {

  return (
    <div className="absolute md:left-[270px] top-[60px] left-0 w-full">

      {/* // Top section */}

      <div className="flex flex-row w-[calc(100vw-270px)] mt-3 mx-3 gap-3">

        <div className=" flex-center basis-1/4 border border-solid border-slate-700 rounded-md">
          <div>

          </div>
        </div>
        <div className="flex-center basis-1/4 border border-solid border-slate-700 rounded-md">
          01
        </div>
        <div className="flex-center basis-1/4 border rounded-md">
          02
        </div>
        <div className="flex-center basis-1/4 border rounded-md">
          03
        </div>

      </div>
      {/* <MultiAvailabilityForm /> */}
    </div>
  )
}

export default Dashboard
