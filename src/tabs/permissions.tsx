import '~/style.css';

import React, { useState } from 'react';

import { neededOrigins } from '~data/config';

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;

function PermissionsPls() {
  const [granted, setGranted] = useState(false);

  return (
    <div>
      <h1 className="">Sk.edge needs permissions to run</h1>
      <p>
        We need access to Schedule Planner and the sources we get our data from.
      </p>
      <h2>Please click the button below to grant permissions.</h2>
      <button
        className="p-2 bg-blue-dark text-white rounded-lg"
        onClick={async () => {
          const response = await realBrowser.permissions.request({
            origins: neededOrigins,
          });
          if (response) {
            setGranted(true);
          }
        }}
      >
        Request permissions
      </button>
      {granted && (
        <p>
          Thank you!
          <br /> You can close this window now.
        </p>
      )}
    </div>
  );
}
export default PermissionsPls;
