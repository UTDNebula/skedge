import contentFile from 'url:./content.ts';

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
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
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});