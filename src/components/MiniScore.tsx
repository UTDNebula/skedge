interface MiniScoreInterface {
  name: string;
  score: number;
  maxScore: number;
  inverted: boolean;
}

export const MiniScore = (props: MiniScoreInterface) => {

  const { name, score, maxScore, inverted } = props;

  const getScoreColor = (value: number, outOf: number) => {
    value = (inverted ? outOf - value : value) / outOf;
    const hue = (value * 120).toString(10);
    return ["hsl(", hue, ",100%,85%)"].join("");
  }

  return(
    <div className="grid grid-cols-12">
      <h3 className="bg-blue-dark rounded-l-xl text-white text-center py-1.5 col-span-5">{name}</h3>
      <h1 style={{backgroundColor: getScoreColor(score, maxScore)}} className="text-blue-dark text-center py-0.5 rounded-r-xl col-span-7">{score}</h1>
    </div>
  )
}