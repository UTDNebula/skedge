import '~/style.css';
import tailwindConfig from '../tailwind.config.js';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Routing } from '~/pages';
import { neededOrigins } from '~data/config';

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;
async function checkPermissions() {
  const currentPermissions: { permissions: string[]; origins: string[] } =
    await realBrowser.permissions.getAll();
  if (
    neededOrigins.filter(
      (origin) => !currentPermissions.origins.includes(origin),
    ).length !== 0
  ) {
    const popupURL = await realBrowser.runtime.getURL('tabs/permissions.html');
    realBrowser.windows.create({
      url: popupURL,
      type: 'popup',
      width: 400,
      height: 600,
    });
  }
}
checkPermissions();

function IndexPopup() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const muiTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      //copied from tailwind.config.js
      primary: {
        main: tailwindConfig.theme.extend.colors.royal,
      },
      secondary: {
        main: tailwindConfig.theme.extend.colors.royal,
        light: tailwindConfig.theme.extend.colors.periwinkle,
      },
      error: {
        main: tailwindConfig.theme.extend.colors.persimmon['500'],
      },
    },
    typography: {
      fontFamily: 'inherit',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
    <MemoryRouter>
      <Routing />
    </MemoryRouter>
    </ThemeProvider>
  );
}

export default IndexPopup;
