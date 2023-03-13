import { TiArrowBack } from "react-icons/ti"
import { FaExternalLinkAlt } from "react-icons/fa"
import { NavigateFunction, useNavigate } from "react-router-dom"

export const ProfileHeader = ({ name, profilePicUrl } : { name: string, profilePicUrl: string }) => {
  const navigation: NavigateFunction = useNavigate();

  const returnToSections = (): void => {
    navigation(-1)
  }

  return (
    <header className="relative rounded-t-2xl bg-blue-dark h-32">
      <div className="translate-y-[18px] grid grid-cols-5">
        <button onClick={returnToSections} className="justify-center items-center flex">
          <TiArrowBack size={40} color="white" className="p-2 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out" />
        </button>
        <h2 className="col-span-3 text-center text-white mx-auto my-auto">{name}</h2>
        <button className="justify-center items-center flex">
          <FaExternalLinkAlt size={40} color="white" className="p-3 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out" />
        </button>
      </div>
      <div className="absolute top-[66px] left-1/2 -translate-x-1/2 rounded-full h-32 w-32 bg-gray-light">
        <img className="object-cover rounded-full h-32 border-8 border-gray-light" src={profilePicUrl} alt="" />
      </div>
    </header>
  )
}