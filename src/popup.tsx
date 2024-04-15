import '~/style.css';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Routing } from '~/pages';
import { neededOrigins } from '~data/config';

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;
async function checkPermissions() {
  console.log('hey from permission check');
  const currentPermissions: { permissions: string[]; origins: string[] } =
    await realBrowser.permissions.getAll();
  console.log(`current permissions: ${currentPermissions.origins}`);
  if (
    neededOrigins.filter(
      (origin) => !currentPermissions.origins.includes(origin),
    ).length !== 0
  ) {
    console.log('opening permission request');
    const popupURL = await realBrowser.runtime.getURL('tabs/permissions.html');
    console.log(popupURL);
    realBrowser.windows.create({
      url: popupURL,
      type: 'popup',
      width: 550,
      height: 250,
    });
  }
}
checkPermissions();

function IndexPopup() {
  return (
    <MemoryRouter>
      <Routing />
    </MemoryRouter>
  );
}

export default IndexPopup;
