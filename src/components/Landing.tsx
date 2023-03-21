import { Card } from "./Card"

export const Landing = () => {

  const navigativeToScheduler = (): void => {
    window.open("https://utdallas.collegescheduler.com/", "_blank")
  }

  return(
    <Card>
      <div className="h-64 flex justify-center items-center">
        <button onClick={navigativeToScheduler} className="text-center flex py-2 px-4 bg-blue-dark hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out">
          <h3 className="text-center text-white">To Galaxy!</h3>
        </button>
      </div>
    </Card>
  )
}