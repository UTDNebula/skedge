import { executeBackground } from "./content"

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
        func: executeBackground
    });
    chrome.action.setBadgeText({text: "!"});
    chrome.action.setBadgeBackgroundColor({color: 'green'});
  } else {
    chrome.action.setBadgeText({text: ""});
  }
});