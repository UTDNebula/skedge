import React from 'react';

import { getScoreColor } from '~utils/styling';

interface MiniScoreProps {
  name: 'RMP' | 'DIFF' | 'WTA';
  title: string;
  score: number;
  maxScore: number;
  inverted: boolean;
  className: string;
}

export const MiniScore = ({
  name,
  title,
  score,
  maxScore,
  inverted,
  className,
}: MiniScoreProps) => {
  return (
    <div className={'grid grid-cols-12 ' + className} title={title}>
      <h3 className="bg-blue-dark rounded-l-xl text-white text-center py-1.5 col-span-5">
        {name}
      </h3>
      {score !== undefined ? (
        <h1
          style={{ backgroundColor: getScoreColor(score, maxScore, inverted) }}
          className="text-blue-dark text-center py-0.5 rounded-r-xl col-span-7"
        >
          {name === 'WTA' ? Math.round(score) + '%' : score.toFixed(1)}
        </h1>
      ) : (
        <h1
          style={{ backgroundColor: 'white' }}
          className="text-blue-dark text-center py-0.5 rounded-r-xl col-span-7"
        >
          NA
        </h1>
      )}
    </div>
  );
};
