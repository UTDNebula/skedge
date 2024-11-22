import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton } from '@mui/material';
import { Storage } from '@plasmohq/storage';
import gradient from 'data-base64:../../assets/gradient.png';
import tutorial1 from 'data-base64:../../assets/tutorial1.png';
import tutorial2 from 'data-base64:../../assets/tutorial2.png';
import React, { useEffect, useState } from 'react';

import { TRENDS_URL } from '~data/config';
import { addGoogleOAuth } from '~popup';

const STORAGE_KEY = 'page';

const ExplanatoryPage = ({
  src,
  title,
  description,
  prev,
  next,
}: {
  src: string;
  title: string;
  description: string;
  prev?: number;
  next?: number;
}) => {
  return (
    <div className="h-full w-full flex flex-col dark:bg-black">
      <img
        src={src}
        alt="tutorial descriptive"
        className="w-full bg-gray-100"
      />
      <div className="grow p-8 flex flex-col gap-4 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm">{description}</p>
        <a
          href="https://www.utdallas.edu/galaxy/"
          target="_blank"
          className="text-base text-blue-600 hover:text-blue-800 visited:text-purple-600 underline decoration-transparent hover:decoration-inherit transition"
          rel="noreferrer"
        >
          Go To Schedule Planner
        </a>
        <div className="mt-auto">
          {typeof prev !== 'undefined' && (
            <IconButton
              aria-label="back"
              className="float-left"
              onClick={() => storage.set(STORAGE_KEY, prev)}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          {typeof next !== 'undefined' && (
            <IconButton
              aria-label="back"
              className="float-right"
              onClick={() => storage.set(STORAGE_KEY, next)}
            >
              <ArrowBackIcon className="rotate-180" />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

const storage = new Storage({
  area: 'local',
});




const Landing = () => {
  const [page, setPage] = useState(0);
  useEffect(() => {
    storage.get(STORAGE_KEY).then((item) => {
      if (typeof item !== 'undefined') {
        setPage(Number(item));
      } else {
        setPage(0);
      }
    });
    storage.watch({
      [STORAGE_KEY]: (c) => {
        setPage(c.newValue);
      },
    });
  }, []);
  
  switch (page) {
    case 0:
      return (
        <div className="bg-lighten dark:bg-darken h-full w-full flex justify-center items-center p-8">
          <img
            src={gradient}
            alt="gradient background"
            className="absolute h-full w-full inset-0 object-cover -z-10"
          />
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold mb-3 text-cornflower-600 dark:text-cornflower-400 tracking-wider">
              POWERED BY{' '}
              <a
                href="https://www.utdnebula.com/"
                target="_blank"
                className="underline decoration-transparent hover:decoration-inherit transition"
                rel="noreferrer"
              >
                NEBULA LABS
              </a>
            </h2>
            <h1 className="text-6xl font-extrabold font-kallisto mb-2">
              SKEDGE
            </h1>
            <h3 className="text-sm font-semibold font-kallisto mb-6">
              FROM{' '}
              <a
                href={TRENDS_URL}
                target="_blank"
                className="underline decoration-transparent hover:decoration-inherit transition"
                rel="noreferrer"
              >
                UTD TRENDS
              </a>
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-7">
              Explore and compare past grades, professor ratings, and reviews to
              find the perfect class.
            </p>
            <Button
              variant="contained"
              disableElevation
              size="large"
              className="normal-case bg-royal hover:bg-royalDark"
              onClick={() => storage.set(STORAGE_KEY, 1)}
            >
              Get Started
            </Button>
            
          </div>
        </div>
      );
    case 1:
      return (
        <ExplanatoryPage
          src={tutorial1}
          title="Open Schedule Planner"
          description="This extension was designed for students at the University of Texas at Dallas and requires the usage of Schedule Planner"
          prev={0}
          next={2}
        />
      );
    case 2:
      return (
        <ExplanatoryPage
          src={tutorial2}
          title="Click Options"
          description="Find the course you want to take and click options. That’s it! You are done."
          prev={1}
        />
      );
  }
};

export default Landing;
