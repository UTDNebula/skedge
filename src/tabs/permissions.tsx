import '~/styles/globals.css';

import { Button } from '@mui/material';
import React, { useState } from 'react';

import { neededOrigins } from '~data/config';

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;

function PermissionsPls() {
  const [granted, setGranted] = useState(false);

  return (
    <div className="p-2">
      <h1 className="text-xl mb-2">Skedge needs permissions to run</h1>
      <p className="text-sm mb-6">
        We need access to Schedule Planner and the sources we get our data from.
      </p>
      <h2 className="text-lg mb-2">
        Please click the button below to grant permissions.
      </h2>
      <Button
        variant="contained"
        disableElevation
        size="large"
        className="normal-case bg-royal hover:bg-royalDark"
        onClick={async () => {
          const response = await realBrowser.permissions.request({
            origins: neededOrigins,
          });
          if (response) {
            setGranted(true);
          }
        }}
      >
        Grant permissions
      </Button>
      {granted && (
        <p className="text-sm">
          Thank you!
          <br /> You can close this window now.
        </p>
      )}
    </div>
  );
}
export default PermissionsPls;
