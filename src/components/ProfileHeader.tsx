import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import type { ProfessorProfileInterface } from '~data/builder';

export const ProfileHeader = ({
  name,
  profilePicUrl,
  profiles,
}: {
  name: string;
  profilePicUrl: string;
  profiles: ProfessorProfileInterface[];
}) => {
  const navigation: NavigateFunction = useNavigate();

  const returnToSections = (): void => {
    navigation('/', { state: profiles });
  };

  return (
    <header className="relative rounded-t-2xl bg-cornflower-600 h-32">
      <div className="translate-y-[18px] grid grid-cols-5">
        <IconButton aria-label="back" onClick={returnToSections}>
          <ArrowBackIcon />
        </IconButton>
        <h2 className="col-span-3 text-center text-white mx-auto my-auto">
          {name.split(' ').at(0) + ' ' + name.split(' ').at(-1)}
        </h2>
      </div>
      <div className="absolute top-[66px] left-1/2 -translate-x-1/2 rounded-full h-32 w-32 bg-slate-200">
        <img
          className="object-cover rounded-full h-32 border-8 border-bg-slate-200"
          src={
            profilePicUrl
              ? profilePicUrl
              : 'https://profiles.utdallas.edu/img/default.png'
          }
          alt="professor profile"
        />
      </div>
    </header>
  );
};
