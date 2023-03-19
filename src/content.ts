/**
 * This script runs when we select a course in the Scheduler
 * - It scrapes the page for course data
 * - It scrapes the names of instructors
 * - It injects the instructor names into the section table
 */
import type { CourseHeader } from "./backgroundInterfaces";

export const config = {
  matches: ["https://utdallas.collegescheduler.com/terms/*/courses/*"]
}

var messageType = {
	SHOW_COURSE_TAB: 'SHOW_COURSE_TAB',
	SHOW_PROFESSOR_TAB: 'SHOW_PROFESSOR_TAB',
}

// send event to to extension to show the course info tab
function sendCourseDataToExtension(courseData: CourseHeader, professors: string[]) {
	chrome.runtime.sendMessage({
		type: messageType.SHOW_COURSE_TAB,
		payload: {
			courseData,
			professors,
		}
	});
}

Promise.all([getCourseInfo(), injectAndGetProfessorNames()]).then(([courseData, professors]) => {
  console.log(courseData.subjectPrefix, courseData.courseNumber, professors);
  sendCourseDataToExtension(courseData, professors);
});

/** Gets the first element from the DOM specified by selector */
function waitForElement(selector: string): Promise<HTMLElement> {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector<HTMLElement>(selector));
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector<HTMLElement>(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

/** Gets the course prefix and number from the course page */
async function getCourseInfo(): Promise<CourseHeader> {
  const course = await waitForElement('h1');
  const courseData = course.innerText.split(" ");
  return { subjectPrefix: courseData[0], courseNumber: courseData[1] };
}

/** Gets all professor names and then injects them into the section table */
async function injectAndGetProfessorNames(): Promise<string[]> {
  const courseTable = await waitForElement('table')
  const professors: string[] = [];
  const courseRows = courseTable.querySelectorAll('tbody');

  // add Professor header to the table
  const tableHeaders = courseTable.querySelector('thead > tr');
  const newHeader = document.createElement('th');
  newHeader.innerText = 'Instructor(s)';
  tableHeaders.insertBefore(newHeader, tableHeaders.children[7]);

  courseRows.forEach(courseRow => {
    // get professor name from course row
    const sectionDetailsButton = courseRow.querySelector<HTMLButtonElement>('tr > td > button');
    // expand section details to load the details
    sectionDetailsButton.click();
    const sectionDetails = courseRow.querySelector('tr:nth-child(2)');
    const sectionDetailsList = sectionDetails.querySelectorAll('li');
    let professor = '';
    sectionDetailsList.forEach(li => {
      const detailLabelText = li.querySelector<HTMLElement>('strong > span').innerText;
      if (detailLabelText.includes('Instructor')) {
        professor = li.innerText.split(":")[1].trim();
      }
    });
    // append professor name to the table
    const newTd = document.createElement('td');
    newTd.innerText = professor;
    // this is in case we have multiple instructions per section
    const sectionProfessors = professor.split(",")
    sectionProfessors.forEach(sectionProfessor => {
      professors.push(sectionProfessor.trim());
    })
    const courseRowCells = courseRow.querySelector('tr');
    courseRowCells.insertBefore(newTd, courseRowCells.children[7]);
    // collapse section details
    sectionDetailsButton.click();
  });
  return [... new Set(professors)];
};

export {}