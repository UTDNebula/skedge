import gradient from 'data-base64:../../assets/gradient.png';
import React from 'react';
import { TRENDS_URL } from '~data/config';

/**
 * This is a component to hold Skedge branding
 * @returns
 */
export function TopMenu() {
  return (
    <div className="relative overflow-hidden flex flex-col py-2 px-4 bg-lighten dark:bg-darken">
      <img
        src={gradient}
        alt="gradient background"
        className="absolute h-full w-full inset-0 object-cover -z-10"
      />
      <h1 className="text-xl font-kallisto font-bold">SKEDGE</h1>
      <h2 className="text-sm font-normal font-kallisto">
        FROM{' '}
        <a
          href={TRENDS_URL}
          target="_blank"
          className="underline decoration-transparent hover:decoration-inherit transition"
          rel="noreferrer"
        >
          UTD TRENDS
        </a>
      </h2>
    </div>
  );
}

export default TopMenu;
