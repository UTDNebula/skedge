import { scrapeCourseData, CourseHeader } from "~content";
import { Storage } from "@plasmohq/storage";

export interface ShowCourseTabPayload {
  header: CourseHeader;
  professors: string[];
}

// State vars
let courseTabId: number = null;
let scrapedCourseData: ShowCourseTabPayload = null;

// for persistent state
const storage = new Storage();

/** Injects the content script if we hit a course page */
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (/^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/courses\/.+$/.test(
      details.url
  )) 
  {
    chrome.scripting.executeScript({
        target: {
            tabId: details.tabId,
        },
        // content script injection only works reliably on the prod packaged extension
        // b/c of the plasmo dev server connections
        func: scrapeCourseData,
    }, async function (resolve) {
      if (resolve && resolve[0] && resolve[0].result) {
        const result: ShowCourseTabPayload = resolve[0].result;
        scrapedCourseData = result;
        await storage.set("scrapedCourseData", scrapedCourseData)
      };
    });
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
    courseTabId = details.tabId
    storage.set("courseTabId", courseTabId)
    storage.set("courseTabUrl", details.url)
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});

/** Sets the icon to be active if we're on a course tab */
chrome.tabs.onActivated.addListener(async details => {
  const cachedTabUrl: string = await storage.get("courseTabUrl")
  const currentTabUrl: string = (await getCurrentTab()).url
  if (cachedTabUrl === currentTabUrl) {
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});

export async function getScrapedCourseData() {
  const cachedTabUrl: string = await storage.get("courseTabUrl")
  const currentTabUrl: string = (await getCurrentTab()).url
  if (cachedTabUrl === currentTabUrl) {
    return await storage.get("scrapedCourseData");
  }
  return null
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}