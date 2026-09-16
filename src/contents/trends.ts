import { Storage } from '@plasmohq/storage';
import type { PlasmoCSConfig } from 'plasmo';

export interface ClassData {
  query: {
    prefix: string;
    number: string;
    profFirst?: string;
    profLast?: string;
    sectionNumbers?: string[];
  };
  semester: string;
}

// Trends localStorage format:
// { query: { prefix, number, profFirst, profLast, sectionNumbers: string[] }, semester }

export const config: PlasmoCSConfig = {
  matches: ['https://trends.utdnebula.com/'],
  world: 'MAIN',
};

const storage = new Storage();

export async function fetchFromTrends() {
  let classes = window.localStorage.getItem('planner_v2');
  JSON.parse(classes).filter((entry: ClassData) => {
    // Only add current semester classes with a specific section
    return (
      entry.query.prefix &&
      entry.query.number &&
      entry.semester &&
      entry.semester === '26F' &&
      entry.query.sectionNumbers &&
      entry.query.sectionNumbers.length > 0
    );
  });
  storage.set('planner_v2_classData', classes);
  console.log(classes);
}