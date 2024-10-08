import React from 'react';
import { FaUser } from 'react-icons/fa';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import type { ProfessorProfileInterface } from '~data/builder';

import { Card } from './Card';
import { MiniGrades } from './MiniGrades';
import { MiniScore } from './MiniScore';

export const MiniProfessor = ({
  professorData,
  profiles,
}: {
  professorData: ProfessorProfileInterface;
  profiles: ProfessorProfileInterface[];
}) => {
  const navigation: NavigateFunction = useNavigate();

  const toProfessorProfile = (): void => {
    navigation('/professor', { state: { professorData, profiles } });
  };

  return (
    <>
      <header className="h-10 rounded-t-2xl bg-blue-dark py-2 pr-3 pl-[14px] flex">
        <h3 className="text-white">{professorData.name}</h3>
        {!professorData.loading && (
          <button onClick={toProfessorProfile} className="ml-auto">
            <FaUser
              size={24}
              color="white"
              className="px-1.5 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out"
            />
          </button>
        )}
      </header>
      <Card>
        <div className="grid grid-cols-12 grid-rows-3 gap-2">
          <MiniScore
            name="RMP"
            title="Overall Quality"
            score={
              professorData.loading
                ? '...'
                : typeof professorData.rmpScore !== 'undefined'
                  ? professorData.rmpScore.toFixed(1)
                  : undefined
            }
            maxScore={5}
            inverted={false}
            className="col-span-4 row-span-1 col-start-1"
          />
          <MiniScore
            name="DIFF"
            title="Level of Difficulty"
            score={
              professorData.loading
                ? '...'
                : typeof professorData.diffScore !== 'undefined'
                  ? professorData.diffScore.toFixed(1)
                  : undefined
            }
            maxScore={5}
            inverted={true}
            className="col-span-4 row-span-1 row-start-2"
          />
          <MiniScore
            name="WTA"
            title="Would take again"
            score={
              professorData.loading
                ? '...'
                : typeof professorData.wtaScore !== 'undefined'
                  ? Math.round(professorData.wtaScore) + '%'
                  : undefined
            }
            maxScore={100}
            inverted={false}
            className="col-span-4 row-span-1 row-start-3"
          />
          <div className="col-span-8 row-span-3 col-start-5 max-h-32">
            <MiniGrades
              series={
                professorData?.gradeDistribution ?? [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
              }
              loading={professorData.loading}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
