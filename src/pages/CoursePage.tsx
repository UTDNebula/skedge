import { sendToBackground } from '@plasmohq/messaging';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { ShowCourseTabPayload } from '~background';
import { Landing } from '~components/Landing';
import { MiniProfessor } from '~components/MiniProfessor';
import {
  buildProfessorProfile,
  type ProfessorProfileInterface,
} from '~data/builder';

// Example of how to fetch the scraped data from the background script, given that it exists
async function getCourseData() {
  const response: ShowCourseTabPayload = await sendToBackground({
    name: 'getScrapeData',
  });
  return response;
}

export const CoursePage = () => {
  // TODO: CHANGE INTERFACE
  const { state }: { state: ProfessorProfileInterface[] } = useLocation();
  const [onCoursebook, setOnCoursebook] = useState(false);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (!state) {
      setOnCoursebook(true);
      getCourseData().then((payload) => {
        console.log(payload);
        if (payload === null) {
          setOnCoursebook(false);
        } else {
          const newProfiles = [];
          for (let i = 0; i < payload.professors.length; i++) {
            newProfiles.push({
              name: payload.professors[i],
              loading: true,
            });
          }
          setProfiles(newProfiles);

          for (let i = 0; i < payload.professors.length; i++) {
            buildProfessorProfile(payload.header, payload.professors[i]).then(
              (profile) => {
                setProfiles((old) => {
                  const newProfiles = [...old];
                  newProfiles[i] = profile;
                  return newProfiles;
                });
              },
            );
          }
        }
      });
    } else {
      setProfiles(state);
      setOnCoursebook(true);
    }
  }, []);

  return (
    <div className="w-[450px] p-4">
      {onCoursebook &&
        profiles.map((item, index) => (
          <div className="mb-4" key={index}>
            <MiniProfessor profiles={profiles} professorData={item} />
          </div>
        ))}
      {!onCoursebook && <Landing />}
    </div>
  );
};
