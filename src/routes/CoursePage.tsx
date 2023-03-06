import { useLocation } from "react-router-dom";
import { MiniProfessor } from "~components/MiniProfessor"
import type { ProfessorProfileInterface } from "./about";

interface CoursePageInterface {
  professors: ProfessorProfileInterface[];
}

export const CoursePage = () => { // TODO: CHANGE INTERFACE
  const { state }: { state: ProfessorProfileInterface[] } = useLocation();
  return(
    <div className="w-[450px] p-4 h-[1000px]">
      {state.map((item, index) => <MiniProfessor key={index} data={item} />)}
    </div>
  )
}