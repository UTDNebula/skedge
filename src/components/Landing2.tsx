import { Card } from "./Card"
import open_schedule_planner from "data-base64:../../assets/SchedulePlanner.svg"
import right_arrow_icon from "data-base64:../../assets/RightArrowIcon.svg"

const GALAXY_URL = "https://www.utdallas.edu/galaxy/"

export const Landing2 = (props: { setLandingSlide: (n: number) => void }) => {
  
    const gotoSlide = (): void => {
        props.setLandingSlide(3)
    }

    const navigativeToScheduler = (): void => {
        window.open(GALAXY_URL, "_blank")
    }

    return(
        <Card>
            <div className="h-auto">
                <img src={open_schedule_planner} alt="" className="float-middle"/> 
                <h1 className = "mt-8 text-left">Open Schedule Planner</h1>
                <h4 className="mt-6">This extension was designed for students at the University of Texas at Dallas and requires the usage of Schedule Planner.</h4>
                {/* The following flex needs to be sized down*/}
                <div className="mt-4 mb-4 flex flex-row align-middle">
                    <svg className="ml-[13px]" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8.5" cy="9" r="8.5" fill="#4F46E5"/>
                    </svg>
                    <svg className="ml-[13px]" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8.5" cy="9" r="8.5" fill="#D9D9D9"/>
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