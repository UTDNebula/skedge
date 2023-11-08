import { Card } from "./Card"

export const Landing = (props: { setLandingSlide: (n: number) => void }) => {

  const gotoSlide = (): void => {
    props.setLandingSlide(2)
  }

  return(
    <Card>
      <div className="h-auto text-center flex flex-col items-center justify-center">
        <h1 className = "mt-8">👋Hey There!</h1>
        <h4 className="m-6">We want to let you know that Sk.edge's B.1 [BETA] version is still in its beta stage and is not yet complete.</h4>
        <h4 className="m-6">As such, it's important to keep in mind that some features may not be fully fuctional, and there may be occasional bugs that need to be worked out. Thank you!</h4>
        <button onClick={gotoSlide} className="mt-4 flex py-2 px-8 rounded-full bg-white border-2 border-indigo-600 transition ease-in-out duration-250">
          <h2 className="text-indigo-600">Got it</h2>
        </button>
      </div>
    </Card>
  )
}