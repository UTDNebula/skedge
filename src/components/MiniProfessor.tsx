import { FaUser } from "react-icons/fa"
import type { ProfessorProfileInterface } from "~routes/about"
import { Card } from "./Card"
import { MiniGrades } from "./MiniGrades"
import { MiniScore } from "./MiniScore"

export const MiniProfessor = ({ data }:{ data: ProfessorProfileInterface }) => {
  return(
    <>
      <header className="h-10 rounded-t-2xl bg-blue-dark py-2 pr-3 pl-[14px] flex">
        <h3 className="text-white">{data.name}</h3>
        <button className="ml-auto"><FaUser size={24} color="white" className="px-1.5 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out" /></button>
      </header>
      <Card>
        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <MiniScore name="RMP" score={4.3} maxScore={5} inverted={false} />
            <div className="my-2"></div>
            <MiniScore name="DIFF" score={4.3} maxScore={5} inverted={true} />
            <div className="my-2"></div>
            <MiniScore name="WTA" score={92} maxScore={100} inverted={false} />
          </div>
          <div className="col-span-8 max-h-[124px]">
            <MiniGrades gradeDistributionData={data.gradeDistributions[0]} />
          </div>
        </div>
      </Card>
    </>
  )
}