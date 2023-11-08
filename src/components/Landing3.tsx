import { Card } from "./Card"
import schedule_planner_options from "data-base64:../../assets/SchedulePlannerOptions.svg"
import right_arrow_icon from "data-base64:../../assets/RightArrowIcon.svg"

const GALAXY_URL = "https://www.utdallas.edu/galaxy/"

export const Landing3 = (props: { setLandingSlide: (n: number) => void }) => {

    const gotoSlide = (): void => {
      props.setLandingSlide(4)
    }
  
    const navigativeToScheduler = (): void => {
        window.open(GALAXY_URL, "_blank")
    }

    return(
      <Card>
          <div className="h-auto">
              <img src={schedule_planner_options} alt="" className="float-middle"/> 
              <h1 className = "mt-8 text-left">Click Options</h1>
              <h4 className="mt-6">Find the course you want to take and click options. That's it! You are done.</h4>
              {/* The following flex needs to be sized down*/}
              <div className="mt-4 mb-4 flex flex-row align-middle">
                    <svg className="ml-[13px]" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8.5" cy="9" r="8.5" fill="#D9D9D9"/>
                    </svg>
                    <svg className="ml-[13px]" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8.5" cy="9" r="8.5" fill="#4F46E5"/>
                    </svg>
                    <svg className="ml-[13px]" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8.5" cy="9" r="8.5" fill="#D9D9D9"/>
                    </svg>
                    <button className="ml-[70px]" onClick={gotoSlide}><img src={right_arrow_icon} alt="" className=""/></button>
                </div>
              <h3 className="mb-2"> <button className="text-purple-dark" onClick={navigativeToScheduler}>Go To Schedule Planner</button></h3>
          </div>
      </Card>
  )
}