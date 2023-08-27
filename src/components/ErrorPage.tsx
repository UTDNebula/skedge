import { Card } from "./Card"

export type CustomError = {
  source: string
  details: Error | string
}

type ErrorProps = {
  error: CustomError
}

export default function ErrorPage(props: ErrorProps) {
  const { error } = props
  return (
    <>
      <header className="h-10 rounded-t-2xl bg-red-dark py-2 pr-3 pl-[14px] flex">
        <h3 className="text-white">Err: {error.source}</h3>
        {/* <button onClick={() => console.log("Fixme!")} className="ml-auto">
          <h2 className="px-1.5 hover:bg-red-dark-hover rounded-lg transition duration-250 ease-in-out text-white">
            ⟳
          </h2>
        </button> */}
      </header>
      <Card>
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <p>{error.details["message"] ?? error.details}</p>
          </div>
        </div>
      </Card>
    </>
  )
}
