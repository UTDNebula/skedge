import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';

import SingleGradesInfo from '~components/SingleGradesInfo';
import SingleProfInfo from '~components/SingleProfInfo';
import { TRENDS_URL } from '~data/config';
import type { RMPInterface } from '~data/fetchFromRmp';
import fetchWithCache, {
  cacheIndexNebula,
  expireTime,
} from '~data/fetchWithCache';
import type { GenericFetchedData, GradesType } from '~pages/CoursePage';
import type SearchQuery from '~utils/SearchQuery';
import { searchQueryLabel } from '~utils/SearchQuery';

const fallbackSrc = 'https://profiles.utdallas.edu/img/default.png';

interface ProfessorInterface {
  _id: string;
  email: string;
  first_name: string;
  image_uri: string;
  last_name: string;
  office: {
    building: string;
    room: string;
    map_uri: string;
  };
  //office_hours: any[];
  phone_number: string;
  profile_uri: string;
  sections: string[];
  titles: string[];
}

type ProfessorOverviewProps = {
  professor: SearchQuery;
  grades: GenericFetchedData<GradesType>;
  rmp: GenericFetchedData<RMPInterface>;
  setPage: (arg0: SearchQuery) => void;
};

const ProfessorOverview = ({
  professor,
  grades,
  rmp,
  setPage,
}: ProfessorOverviewProps) => {
  const [profData, setProfData] = useState<
    GenericFetchedData<ProfessorInterface>
  >({ state: 'loading' });

  const [src, setSrc] = useState(fallbackSrc);

  useEffect(() => {
    setProfData({ state: 'loading' });
    fetchWithCache(
      TRENDS_URL +
        'api/professor?profFirst=' +
        encodeURIComponent(String(professor.profFirst)) +
        '&profLast=' +
        encodeURIComponent(String(professor.profLast)),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
      cacheIndexNebula,
      expireTime,
    )
      .then((response) => {
        if (response.message !== 'success') {
          throw new Error(response.message);
        }
        setProfData({
          state: typeof response.data !== 'undefined' ? 'done' : 'error',
          data: response.data as ProfessorInterface,
        });
        setSrc(response.data.image_uri);
      })
      .catch((error) => {
        setProfData({ state: 'error' });
        console.error('Professor data', error);
      });
  }, [professor]);

  return (
    <div className="relative flex flex-col gap-2">
      <IconButton
        aria-label="back"
        className="absolute top-1 left-1"
        onClick={() => setPage('list')}
      >
        <ArrowBackIcon />
      </IconButton>
      {profData.state === 'loading' ? (
        <Skeleton variant="circular" className="w-32 h-32 self-center" />
      ) : (
        <img
          src={src}
          alt="Headshot"
          className="w-32 h-32 rounded-full self-center"
          onError={() => {
            setSrc(fallbackSrc);
          }}
        />
      )}
      <div className="flex flex-col items-center">
        {profData.state === 'loading' && (
          <>
            <Skeleton className="text-2xl font-bold w-[15ch]" />
            <Skeleton className="w-[25ch]" />
            <Skeleton className="w-[20ch]" />
            <Skeleton className="w-[10ch]" />
          </>
        )}
        {profData.state === 'done' && typeof profData.data !== 'undefined' && (
          <>
            <p className="text-2xl font-bold self-center">
              {searchQueryLabel(professor)}
            </p>
            {profData.data.email !== '' && (
              <a
                href={'mailto:' + profData.data.email}
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                rel="noreferrer"
              >
                {profData.data.email}
              </a>
            )}

            {profData.data.office.map_uri !== '' &&
              profData.data.office.building !== '' &&
              profData.data.office.room !== '' && (
                <p>
                  Office:{' '}
                  <a
                    href={profData.data.office.map_uri}
                    target="_blank"
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    rel="noreferrer"
                  >
                    <b>
                      {profData.data.office.building +
                        ' ' +
                        profData.data.office.room}
                    </b>
                  </a>
                </p>
              )}
            {profData.data.profile_uri !== '' && (
              <a
                href={profData.data.profile_uri}
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                rel="noreferrer"
              >
                Faculty Profile
              </a>
            )}
          </>
        )}
      </div>
      <SingleGradesInfo
        title="# of Students (Overall)"
        course={professor}
        grades={grades}
      />
      <SingleProfInfo rmp={rmp} />
    </div>
  );
};

export default ProfessorOverview;
