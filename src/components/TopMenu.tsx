import { TRENDS_URL } from '~data/config';
import gradient from 'data-base64:../../assets/gradient.png';
import React from 'react';
import { SkedgeLogoStandalone } from './SkedgeLogo';

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
      <div className="font-display flex gap-2 items-center select-none text-haiti dark:text-white py-2">
        <div className="flex flex-row items-center">
          <SkedgeLogoStandalone className="h-10 w-auto fill-haiti dark:fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-lg md:text-xl font-bold leading-5">
            SKEDGE
          </span>
          <span className="whitespace-nowrap text-xs md:text-sm font-medium">
            from{' '}
            <a
              href={TRENDS_URL}
              target="_blank"
              className="underline decoration-transparent hover:decoration-inherit transition"
              rel="noreferrer"
            >
              UTD TRENDS
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
