import React from 'react';

export const Footer = () => {
  return (
    <div className="rounded-b-2xl p-2 bg-slate-200 -mb-4 -ml-4 -mr-4 flex items-center justify-center">
      <p className="text-sm font-semibold text-cornflower-600 tracking-wider">
        POWERED BY{' '}
        <a
          href="https://www.utdnebula.com/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-transparent hover:decoration-inherit transition"
        >
          NEBULA LABS
        </a>
      </p>
    </div>
  );
};
