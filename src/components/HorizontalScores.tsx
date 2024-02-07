import React from 'react';

import { getScoreColor } from '~utils/styling';

interface Scores {
  rmpScore: number;
  diffScore: number;
  wtaPercent: number;
}

export const HorizontalScores = ({
  rmpScore,
  diffScore,
  wtaPercent,
}: Scores) => {
  return (
    <div className="grid grid-cols-3">
      <h2 className="bg-blue-dark text-white text-center py-1 rounded-tl-2xl">
        RMP
      </h2>
      <h2 className="bg-blue-dark text-white text-center py-1">DIFF</h2>
      <h2 className="bg-blue-dark text-white text-center py-1 rounded-tr-2xl">
        WTA
      </h2>
      <h1
        style={{ backgroundColor: getScoreColor(rmpScore, 5, false) }}
        className="text-blue-dark text-center py-0.5 rounded-bl-2xl"
      >
        {rmpScore ? rmpScore.toFixed(1) : 'NA'}
      </h1>
      <h1
        style={{ backgroundColor: getScoreColor(diffScore, 5, true) }}
        className="text-blue-dark text-center py-0.5"
      >
        {diffScore ? diffScore.toFixed(1) : 'NA'}
      </h1>
      <h1
        style={{ backgroundColor: getScoreColor(wtaPercent, 100, false) }}
        className="text-blue-dark text-center py-0.5 rounded-br-2xl"
      >
        {wtaPercent ? Math.round(wtaPercent) : 'NA'}%
      </h1>
    </div>
  );
};
