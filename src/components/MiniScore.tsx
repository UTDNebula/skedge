import { getScoreColor } from "~utils/styling";

interface MiniScoreProps {
  name: "RMP" | "DIFF" | "WTA";
  score: number;
  maxScore: number;
  inverted: boolean;
}

export const MiniScore = ({ name, score, maxScore, inverted } : MiniScoreProps) => {

  return(
    <div className="grid grid-cols-12">
      <h3 className="bg-blue-dark rounded-l-xl text-white text-center py-1.5 col-span-5">{name}</h3>
      <h1 style={{backgroundColor: getScoreColor(score, maxScore, inverted)}} className="text-blue-dark text-center py-0.5 rounded-r-xl col-span-7">{name == "WTA" ? score : score.toFixed(1)}</h1>
    </div>
  )}