import skedgeLogo from 'data-base64:../../assets/icon.png';
import React from 'react';

import { Card } from './Card';
import { Footer } from './Footer';

const SURVEY_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScGIXzlYgsx1SxHYTTCwRaMNVYNRe6I67RingPRVzcT1tLwSg/viewform?usp=sf_link';
const GALAXY_URL = 'https://www.utdallas.edu/galaxy/';

export const Landing = () => {
  const navigativeToScheduler = (): void => {
    window.open(GALAXY_URL, '_blank');
  };

  const navigateToSurvey = (): void => {
    window.open(SURVEY_URL, '_blank');
  };

  return (
    <Card>
      <div className="h-auto">
        <h1>Welcome to sk.edge 👋</h1>
        <h6 className="my-2">
          your registration assistant by students, for students
        </h6>
        <img
          src={skedgeLogo}
          alt=""
          className="w-[100px] h-[100px] float-right"
        />
        <p className="mb-2">
          Log into <b>Schedule Planner</b> and click <b>Options</b> on a course
          to get started!
        </p>
        <p className="mb-2">
          Got feedback? Let us know{' '}
          <button className="text-purple-dark" onClick={navigateToSurvey}>
            here
          </button>
          !
        </p>
        <button
          onClick={navigativeToScheduler}
          className="text-center flex py-2 px-4 mb-4 bg-blue-dark hover:bg-blue-dark-hover rounded-lg transition duration-250 ease-in-out"
        >
          <h3 className="text-center text-white">To Galaxy!</h3>
        </button>
        <Footer />
      </div>
    </Card>
  );
};
