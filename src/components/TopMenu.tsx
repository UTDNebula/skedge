import NebulaLogo from '~components/NebulaLogo';
import { TRENDS_URL } from '~data/config';
import gradient from 'data-base64:../../assets/gradient.png';
import React from 'react';

/**
 * This is a component to hold Skedge branding
 * @returns
 */
export function TopMenu() {
  return (
    <div className="relative overflow-hidden flex gap-2 items-center py-2 px-4 bg-lighten dark:bg-darken">
      <img
        src={gradient}
        alt="gradient background"
        className="absolute h-full w-full inset-0 object-cover -z-10"
      />
      <NebulaLogo className="h-8 w-auto fill-haiti dark:fill-white" />
      <div className="flex flex-col">
        <h1 className="text-xl font-display font-bold">SKEDGE</h1>
        <h2 className="text-sm font-normal font-display">
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
    </div>
  );
}

export default TopMenu;
