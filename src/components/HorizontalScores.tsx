interface Scores {
  rmpScore: number;
  diffScore: number;
  wtaPercent: number;
}

export const HorizontalScores = ({ rmpScore, diffScore, wtaPercent }:Scores) => {
  const getScoreColor = (value: number, outOf: number) => {
    value /= outOf;
    const hue = (value * 120).toString(10);
    return ["hsl(", hue, ",100%,85%)"].join("");
  }

  return (
    <div className="grid grid-cols-3">
      <h2 className="bg-blue-dark text-white text-center py-1 rounded-tl-2xl">RMP</h2>
      <h2 className="bg-blue-dark text-white text-center py-1">DIFF</h2>
      <h2 className="bg-blue-dark text-white text-center py-1 rounded-tr-2xl">WTA</h2>
      <h1 style={{backgroundColor: getScoreColor(rmpScore, 5)}} className="text-blue-dark text-center py-0.5 rounded-bl-2xl">{rmpScore}</h1>
      <h1 style={{backgroundColor: getScoreColor(5-diffScore, 5)}} className="text-blue-dark text-center py-0.5">{diffScore}</h1>
      <h1 style={{backgroundColor: getScoreColor(wtaPercent, 100)}} className="text-blue-dark text-center py-0.5 rounded-br-2xl">{wtaPercent}%</h1>
    </div>
  )
}