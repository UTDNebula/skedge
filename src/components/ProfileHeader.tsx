import { TiArrowBack } from "react-icons/ti"
import { FaExternalLinkAlt } from "react-icons/fa"

export const ProfileHeader = ({ name }) => {
  
  return (
    <header className="relative rounded-t-2xl bg-blue-dark h-32">
      <div className="translate-y-[18px] grid grid-cols-5">
        <button className="justify-center items-center flex "><TiArrowBack size={40} color="white" className="p-2 hover:bg-blue-dark-hover rounded-lg" /></button>
        <h2 className="col-span-3 text-center text-white mx-auto my-auto">{name}</h2>
        <button className="justify-center items-center flex"><FaExternalLinkAlt size={40} color="white" className="p-3 hover:bg-blue-dark-hover rounded-lg" /></button>
      </div>
      <div className="absolute top-[66px] left-1/2 -translate-x-1/2 rounded-full h-32 w-32 bg-gray-light">
        <img className="object-cover rounded-full h-32 border-8 border-gray-light hover:border-gray" src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSUe2eaB9QYVkoJORkwnG2yfpPRqpqvRyUkWXOfvLOirm1mudvx" alt="" />
      </div>
    </header>
  )
}