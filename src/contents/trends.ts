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
  matches: ['https://trends.utdnebula.com/*'],
};

const storage = new Storage();

export function getCurrentSemester(): ClassData['semester'] {
  const today = new Date();
  const year = today.getFullYear() % 100;
  const month = today.getMonth();
  const semester = month < 5 ? 'S' : month < 8 ? 'U' : 'F';
  return `${year}${semester}` as ClassData['semester'];
}

export async function fetchFromTrends() {
  const classes = window.localStorage.getItem('planner_v2');
  const parsedClasses = JSON.parse(classes);
  const filteredClasses = parsedClasses.filter((entry: ClassData) => {
    // Only add current semester classes with a specific section
    return (
      entry.query.prefix &&
      entry.query.number &&
      entry.semester &&
      entry.semester === getCurrentSemester() &&
      entry.query.sectionNumbers &&
      entry.query.sectionNumbers.length > 0
    );
  });
  storage.set('planner_v2_classData', filteredClasses);
  console.log('Updated planner_v2_classData with new data:', filteredClasses);
  console.log('Current semester:', getCurrentSemester());
}

// Listen for changes to localStorage
window.addEventListener('planner-updated', fetchFromTrends);

// When extensions load, fetch the data from Trends
fetchFromTrends();
