import { Storage } from '@plasmohq/storage';

import {
  addGCalButtons,
  listenForTableChange,
  scrapeCourseData,
} from '~content';
import { neededOrigins } from '~data/config';
import { type SearchQuery } from '~types/SearchQuery';

export interface ShowCourseTabPayload {
  header: string | SearchQuery;
  professors: SearchQuery[];
}

// State vars
let courseTabId: number = null;
let scrapedCourseData: ShowCourseTabPayload = null;

// for persistent state
const storage = new Storage();

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;

/** Injects the content script if we hit a course page */
realBrowser.webNavigation.onHistoryStateUpdated.addListener((details) => {
  const onOptions =
    /^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/courses\/.+$/.test(
      details.url,
    );
  const onCurrentSchedule =
    /^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/currentschedule$/.test(
      details.url,
    );
  const onPotentialSchedule =
    /^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/schedules/.test(
      details.url,
    );
  if (onOptions) {
    //Listen for table change to rescrape data
    realBrowser.tabs.sendMessage(details.tabId, 'disconnectObserver');
    realBrowser.scripting.executeScript({
      target: {
        tabId: details.tabId,
      },
      func: listenForTableChange,
    });
  }
  if (onOptions || onCurrentSchedule || onPotentialSchedule) {
    //Scrape data
    realBrowser.scripting.executeScript(
      {
        target: {
          tabId: details.tabId,
        },
        // content script injection only works reliably on the prod packaged extension
        // b/c of the plasmo dev server connections
        func: scrapeCourseData,
      },
      async function (resolve) {
        if (resolve && resolve[0] && resolve[0].result) {
          const result: ShowCourseTabPayload = resolve[0].result;
          scrapedCourseData = result;
          await storage.set('scrapedCourseData', scrapedCourseData);
        }
      },
    );
    //Store tab info
    realBrowser.action.setBadgeText({ text: '!' });
    realBrowser.action.setBadgeBackgroundColor({ color: 'green' });
    courseTabId = details.tabId;
    storage.set('courseTabId', courseTabId);
    storage.set('courseTabUrl', details.url);
  }
  if (onCurrentSchedule) {
    //Add GCal buttons
    realBrowser.scripting.executeScript({
      target: {
        tabId: details.tabId,
      },
      // content script injection only works reliably on the prod packaged extension
      // b/c of the plasmo dev server connections
      func: addGCalButtons,
    });
  }
  if (!onOptions && !onCurrentSchedule && !onPotentialSchedule) {
    realBrowser.action.setBadgeText({ text: '' });
  }
});

/** Rescrape data on table change */
realBrowser.runtime.onMessage.addListener(function (message) {
  if (message === 'tableChange') {
    realBrowser.scripting.executeScript(
      {
        target: {
          tabId: courseTabId,
        },
        func: scrapeCourseData,
      },
      async function (resolve) {
        if (resolve && resolve[0] && resolve[0].result) {
          const result: ShowCourseTabPayload = resolve[0].result;
          scrapedCourseData = result;
          await storage.set('scrapedCourseData', scrapedCourseData);
        }
      },
    );
  }
});

/** Sets the icon to be active if we're on a course tab */
realBrowser.tabs.onActivated.addListener(async () => {
  const cachedTabUrl: string = await storage.get('courseTabUrl');
  const currentTabUrl: string = (await getCurrentTab()).url;
  if (cachedTabUrl === currentTabUrl) {
    realBrowser.action.setBadgeText({ text: '!' });
    realBrowser.action.setBadgeBackgroundColor({ color: 'green' });
  } else {
    realBrowser.action.setBadgeText({ text: '' });
  }
});

realBrowser.runtime.onInstalled.addListener(async () => {
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
});

export async function getScrapedCourseData() {
  const cachedTabUrl: string = await storage.get('courseTabUrl');
  const currentTabUrl: string = (await getCurrentTab()).url;
  if (cachedTabUrl === currentTabUrl) {
    return await storage.get('scrapedCourseData');
  }
  return null;
}

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await realBrowser.tabs.query(queryOptions);
  return tab;
}
