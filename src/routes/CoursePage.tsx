import { useLocation } from "react-router-dom";
import { MiniProfessor } from "~components/MiniProfessor"
import type { ProfessorProfileInterface } from "./about";

export const CoursePage = () => { // TODO: CHANGE INTERFACE
  const { state } : { state: ProfessorProfileInterface[] } = useLocation();

  return(
    <div className="w-[450px] p-4">
      {state.map((item, index) => <div className="mb-4"><MiniProfessor key={index} professorData={item} /></div>)}
    </div>
  )
}