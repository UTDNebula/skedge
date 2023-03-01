import { NavigateFunction, useNavigate } from "react-router-dom"

export const ProfileHeader = () => {
  
  return (
    <header className="relative rounded-t-2xl bg-blue-dark h-32">
      <div className="flex translate-y-[20px]">
        <span className="flex-auto text-center">icon</span>
        <h2 className="flex-auto text-center text-white mx-auto">John Deere</h2>
        <span className="flex-auto text-center">icon</span>
      </div>
      <div className="absolute top-[66px] left-1/2 -translate-x-1/2 rounded-full h-32 w-32 bg-gray-light">
        <img className="object-cover rounded-full h-32 border-8 border-gray-light hover:border-gray" src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSUe2eaB9QYVkoJORkwnG2yfpPRqpqvRyUkWXOfvLOirm1mudvx" alt="" />
      </div>
    </header>
  )
}