import contentFile from 'url:./content.ts';
import type { CourseHeader, ShowCourseTabPayload } from "./backgroundInterfaces";
import { redirect } from "react-router-dom";

let courseTabId: number = null;

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
        files: [contentFile.replace(/chrome-extension:\/\/[a-z]*\/([\w\.\_\-]*)(?:.*)/i, '$1')]
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

// listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  switch (request.type) {
      case messageType.SHOW_COURSE_TAB:
        let payload: ShowCourseTabPayload = request.payload;
          const { courseData, professors } = payload;
          console.log("Background has received course data", courseData, professors)
          

          // FIXME 


            // DEAR ADDAM, THIS DOES NOT WORK BECAUSE OF REACT ROUTING THAT WE HAVE
            // I HAVE SCOURED THE NET FAR AND WIDE AND COULD NOT LOCATE THE ANSWER
            // :(

            // FIXME

          // chrome.action.setPopup({
          //     popup: `/test?subjectPrefix=${courseData.subjectPrefix}&courseNumber=${courseData.courseNumber}&professors=${professors.join(",")}`,
          // });
          break;
      default:
          console.log("Unknown message type");
  }
});