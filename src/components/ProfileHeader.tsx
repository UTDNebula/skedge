import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { TiArrowBack } from 'react-icons/ti';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import type { ProfessorProfileInterface } from '~data/builder';

export const ProfileHeader = ({
  name,
  profilePicUrl,
  rmpId,
  profiles,
}: {
  name: string;
  profilePicUrl: string;
  rmpId: number;
  profiles: ProfessorProfileInterface[];
}) => {
  const navigation: NavigateFunction = useNavigate();

  const returnToSections = (): void => {
    navigation('/', { state: profiles });
  };

  const navigativeToRmp = (): void => {
    window.open(
      'https://www.ratemyprofessors.com/professor/' + rmpId,
      '_blank',
    );
  };

  return (
    <header className="relative rounded-t-2xl bg-blue-dark h-32">
      <div className="translate-y-[18px] grid grid-cols-5">
        <button
          onClick={returnToSections}
          className="justify-center items-center flex"
        >
          <TiArrowBack
            size={40}
            color="white"
            className="p-2 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out"
          />
        </button>
        <h2 className="col-span-3 text-center text-white mx-auto my-auto">
          {name.split(' ').at(0) + ' ' + name.split(' ').at(-1)}
        </h2>
        <button
          className="justify-center items-center flex"
          onClick={navigativeToRmp}
        >
          <FaExternalLinkAlt
            size={40}
            color="white"
            className="p-3 hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out"
          />
        </button>
      </div>
      <div className="absolute top-[66px] left-1/2 -translate-x-1/2 rounded-full h-32 w-32 bg-gray-light">
        <img
          className="object-cover rounded-full h-32 border-8 border-gray-light"
          src={
            profilePicUrl
              ? profilePicUrl
              : 'https://profiles.utdallas.edu/img/default.png'
          }
          alt=""
        />
      </div>
    </header>
  );
};
