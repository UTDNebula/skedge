import '~/styles/globals.css';

import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

import Index from '~/app';
import { neededOrigins } from '~data/config';

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;
async function checkPermissions() {
  const currentPermissions: { origins?: string[] } =
    await realBrowser.permissions.getAll();
  if (
    typeof currentPermissions.origins === 'undefined' ||
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
        main: prefersDarkMode ? '#a297fd' : '#573dff',
      },
      secondary: {
        main: '#573dff',
        light: '#c2c8ff',
      },
      error: {
        main: '#ff5743',
      },
    },
    typography: {
      fontFamily: 'inherit',
    },
    breakpoints: {
      values: {
        //copied from tailwind.config.js
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <Index />
    </ThemeProvider>
  );
}

export default IndexPopup;
