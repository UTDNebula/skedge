import React from 'react';

const neededOrigins = [
  'https://utdallas.collegescheduler.com/terms/*/courses/*',
  'https://www.ratemyprofessors.com/',
  'https://trends.utdnebula.com/',
];
const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;
function PermissionsPls() {
  return (
    <div>
      <h1>We need permissions.</h1>
      <button
        onClick={async () => {
          await realBrowser.permissions.request({ origins: neededOrigins });
        }}
      >
        request permissions
      </button>
    </div>
  );
}
export default PermissionsPls;
