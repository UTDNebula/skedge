import '~/style.css';

import { useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import Index from '~/pages';
import { neededOrigins } from '~data/config';

import tailwindConfig from '../tailwind.config.js';

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

export const addGoogleOAuth = () => {
  try {
    chrome.identity.getAuthToken({
      interactive: true,
    }, (token)=>{
      if (!token) {
        console.log("No token found")
      }
      chrome.storage.local.set({ token: token }, function () {});
    });
    
    
  } catch (error) {
    console.log("no token");
    alert(error);
  }
}
const fullConfig = resolveConfig(tailwindConfig);

function IndexPopup() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const muiTheme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      //copied from tailwind.config.js
      primary: {
        main: fullConfig.theme.colors.royal,
      },
      secondary: {
        main: fullConfig.theme.colors.royal,
        light: fullConfig.theme.colors.periwinkle,
      },
      error: {
        main: fullConfig.theme.colors.persimmon['500'],
      },
    },
    typography: {
      fontFamily: 'inherit',
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <Index />
    </ThemeProvider>
  );
}

export default IndexPopup;
