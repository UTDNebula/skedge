import React, { useState } from 'react';

import { neededOrigins } from '~data/config';

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;

function PermissionsPls() {
  const [granted, setGranted] = useState(false);

  return (
    <div>
      <h1>Skedge needs permissions to run</h1>
      <p>
        We need access to Schedule Planner and the sources we get our data from.
      </p>
      <p>Please click the button below to grant permissions.</p>
      <button
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
      {granted && <p>Thank you!</p>}
    </div>
  );
}
export default PermissionsPls;
