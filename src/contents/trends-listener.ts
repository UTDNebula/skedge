import type { PlasmoCSConfig } from 'plasmo';


// Storage prototype is only available in the main world

export const config: PlasmoCSConfig = {
  matches: ['https://trends.utdnebula.com/*'],
  world: 'MAIN',
};

const originalSetItem = Storage.prototype.setItem.bind(localStorage);

Storage.prototype.setItem = (key, value) => {
  originalSetItem(key, value);
  window.dispatchEvent(new Event('planner-updated'));
};