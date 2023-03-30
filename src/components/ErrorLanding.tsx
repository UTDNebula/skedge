import {Card} from "./Card";

function fixme() {
    console.log("Fix me!");
}

export const ErrorLanding = ({errSrc, error} : {errSrc: string, error: string}) => {
    return(
        <>
          <header className="h-10 rounded-t-2xl bg-red-dark py-2 pr-3 pl-[14px] flex">
            <h3 className="text-white">Errors Found.</h3>
            <button onClick={fixme} className="ml-auto">
              <h2 className="px-1.5 hover:bg-red-dark-hover rounded-lg transition duration-250 ease-in-out text-white">⟳</h2>
            </button>
          </header>
          <Card>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <h3>{errSrc}</h3>
                    <p>err: {error}</p>
                    </div>
            </div>
          </Card>
        </>
      )
};