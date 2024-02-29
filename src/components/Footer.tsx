import nebulaLogo from 'data-base64:../../assets/icon-black.svg';
import React from 'react';

export const Footer = () => {
  return (
    <div className="rounded-b-2xl p-2 bg-gray-light -mb-4 -ml-4 -mr-4">
      <div className="flex items-center justify-center">
        <h4 className="pr-2">Powered by Nebula Labs</h4>
        <a
          href="https://www.utdnebula.com/"
          target="_blank"
          rel="noreferrer"
          className="w-8 h-8"
        >
          <img
            src={nebulaLogo}
            alt="Nebula Labs Logo"
            className="w-8 h-8 hover:cursor-pointer"
          ></img>
        </a>
      </div>
    </div>
  );
};
