import contentFile from 'url:./content.ts';
import type { CourseHeader, ShowCourseTabPayload } from "../backgroundInterfaces";
import ScrapeCourseData from "./content";
import { redirect } from "react-router-dom";

let courseTabId: number = null;
let scrapedCourseData: ShowCourseTabPayload = null;

const messageType = {
  SHOW_COURSE_TAB: "SHOW_COURSE_TAB",
  SHOW_PROFESSOR_TAB: "SHOW_PROFESSOR_TAB",
  REQUEST_PROFESSORS: "REQUEST_PROFESSORS",
  GET_NEBULA_PROFESSOR: "GET_NEBULA_PROFESSOR",
  GET_NEBULA_COURSE: "GET_NEBULA_COURSE",
  GET_NEBULA_SECTIONS: "GET_NEBULA_SECTIONS"
};

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
        world: "MAIN",
        // below is a gigamega hack from https://github.com/PlasmoHQ/plasmo/issues/150
        // content script injection only works reliably on the prod packaged extension
        // b/c of the plasmo dev server connections
        func: ScrapeCourseData,
    }, function (resolve) {
      if (resolve && resolve[0] && resolve[0].result) {
        const result: ShowCourseTabPayload = resolve[0].result;
        
        // Now let's save this scraped value.
        scrapedCourseData = result;
      };
    });
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
    courseTabId = details.tabId
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});

/** Sets the icon to be active if we're on a course tab */
chrome.tabs.onActivated.addListener(details => {
  if (details.tabId == courseTabId) {
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});

export function getScrapedCourseData() {
  return scrapedCourseData;
}