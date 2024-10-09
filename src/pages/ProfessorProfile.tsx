import React from 'react';
import { useLocation } from 'react-router-dom';

import { Card } from '~components/Card';
import { HorizontalScores } from '~components/HorizontalScores';
import { ProfileFooter } from '~components/ProfileFooter';
import { ProfileGrades } from '~components/ProfileGrades';
import { ProfileHeader } from '~components/ProfileHeader';
import { RmpRatings } from '~components/RmpRatings';
import { RmpTag } from '~components/RmpTag';
import type { ProfessorProfileInterface } from '~data/builder';

export const ProfessorProfile = () => {
  const {
    state,
  }: {
    state: {
      professorData: ProfessorProfileInterface;
      profiles: ProfessorProfileInterface[];
    };
  } = useLocation();
  const { professorData, profiles } = state;

  const compareArrays = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  return (
    <div className="w-[400px] p-4">
      <ProfileHeader
        name={professorData.name}
        profilePicUrl={professorData.profilePicUrl}
        profiles={profiles}
      />
      <Card>
        <div className="my-16"></div> {/* spacer */}
        <HorizontalScores
          rmpScore={professorData.rmpScore}
          diffScore={professorData.diffScore}
          wtaPercent={professorData.wtaScore}
        />
        <div className="flex flex-wrap gap-2 my-2 justify-center">
          {' '}
          {/* RMP Tag area */}
          {professorData.rmpTags
            ?.slice(0, 5)
            .map((item: string, index: number) => (
              <RmpTag key={index} text={item.toUpperCase()} />
            ))}
        </div>
        {professorData.ratingsDistribution.length > 0 &&
          !compareArrays(
            professorData.ratingsDistribution,
            Array(5).fill(0),
          ) && (
            <RmpRatings
              series={professorData.ratingsDistribution}
              total={professorData.totalRatings}
            />
          )}
        <ProfileGrades
          series={professorData.gradeDistribution}
          total={professorData.totalGrades}
        />
        <ProfileFooter name={professorData.name} rmpId={professorData.rmpId} />
      </Card>
    </div>
  );
};
