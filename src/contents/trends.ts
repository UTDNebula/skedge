import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://trends.utdnebula.com/'],
  world: 'MAIN',
};

const classData = window.localStorage.getItem('planner_v2');

const storage = new Storage();
storage.set('classData', classData);

console.log(classData);
