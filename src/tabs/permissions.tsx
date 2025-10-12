import '~/styles/globals.css';

import { Button } from '@mui/material';
import * as Sentry from '@sentry/react';
import React, { useState } from 'react';

import { neededOrigins } from '~data/config';

//Same as in src/popup.tsx
Sentry.init({
  dsn: 'https://c7a0478d8f145e3c8f690bf523d8b9cd@o4504918397353984.ingest.us.sentry.io/4509386315071488',

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      showBranding: false,
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

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
        className="normal-case bg-royal hover:bg-royal-dark"
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
export default Sentry.withProfiler(PermissionsPls);
