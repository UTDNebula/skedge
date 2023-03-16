import contentFile from 'url:./content.ts';

let courseTabId: number = null;

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