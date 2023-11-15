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
        <button onClick={toProfessorProfile} className="ml-auto">
          <FaUser
            size={24}
            color="white"
            className="px-1.5 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out"
          />
        </button>
      </header>
      <Card>
        <div className="grid grid-cols-12">
          <div className="col-span-4">
            <MiniScore
              name="RMP"
              score={professorData.rmpScore}
              maxScore={5}
              inverted={false}
            />
            <div className="my-2"></div>
            <MiniScore
              name="DIFF"
              score={professorData.diffScore}
              maxScore={5}
              inverted={true}
            />
            <div className="my-2"></div>
            <MiniScore
              name="WTA"
              score={professorData.wtaScore}
              maxScore={100}
              inverted={false}
            />
          </div>
          <div className="col-span-8 max-h-[124px]">
            <MiniGrades
              gradeDistributionData={professorData.gradeDistributions[0]}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
