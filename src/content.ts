import type { PlasmoCSConfig } from 'plasmo';

export interface CourseHeader {
  subjectPrefix: string;
  courseNumber: string;
}

// Plasmo CS config export
export const config: PlasmoCSConfig = {
  matches: [
    'https://utdallas.collegescheduler.com/terms/*/courses/*',
    'https://utdallas.collegescheduler.com/terms/*/currentschedule',
  ],
  world: 'MAIN',
};

/**
 * This script runs when we select a course in the Scheduler
 * - It scrapes the page for course data
 * - It scrapes the names of instructors
 * - It injects the instructor names into the section table
 */
export async function scrapeCourseData() {
  console.log('scraping course data');
  const [header, professors] = await Promise.all([
    getCourseInfo(),
    injectAndGetProfessorNames(),
  ]);
  return { header: header, professors: professors };

  /** Gets the first element from the DOM specified by selector */
  function waitForElement(selector: string): Promise<HTMLElement> {
    return new Promise((resolve) => {
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
        subtree: true,
      });
    });
  }

  /** Gets the course prefix and number from the course page */
  async function getCourseInfo(): Promise<CourseHeader> {
    const course = await waitForElement('h1');
    const courseData = course.innerText.split(' ');
    return { subjectPrefix: courseData[0], courseNumber: courseData[1] };
  }

  /** Gets all professor names and then injects them into the section table */
  async function injectAndGetProfessorNames(): Promise<string[]> {
    const professors: string[] = [];
    const courseTable = await waitForElement('table');
    const courseRows = courseTable.querySelectorAll('tbody');

    // add Professor header to the table
    const tableHeaders = courseTable.querySelector('thead > tr');
    const newHeader = document.createElement('th');
    const line1 = document.createElement('div');
    line1.innerText = 'Instructor(s)';
    newHeader.append(line1);

    chrome.storage.local.get('token', async function (tokenStored) {
      console.log(tokenStored);
      if (typeof tokenStored.token !== 'undefined') {
        // add Save to Skedge
        const newHeader2 = document.createElement('th');
        const saveLine = document.createElement('div');
        line1.innerText = 'Save';
        newHeader2.append(saveLine);
        tableHeaders.insertBefore(newHeader2, tableHeaders.children[1]);
      }
    });
    // add Skedge reminder
    const line2 = document.createElement('div');
    line2.style.fontWeight = 'normal';
    line2.style.paddingTop = '0.5rem';
    line2.innerText = 'From Skedge';
    newHeader.append(line2);
    tableHeaders.insertBefore(newHeader, tableHeaders.children[7]);

    courseRows.forEach((courseRow) => {
      console.log('row');
      // get professor name from course row
      const sectionDetailsButton =
        courseRow.querySelector<HTMLButtonElement>('tr > td > button');
      // expand section details to load the details
      sectionDetailsButton.click();
      const sectionDetails = courseRow.querySelector('tr:nth-child(2)');
      const sectionDetailsList = sectionDetails.querySelectorAll('li');
      let professor = '';
      let title = '';
      sectionDetailsList.forEach((li) => {
        const detailLabelText =
          li.querySelector<HTMLElement>('strong > span').innerText;
        if (detailLabelText.includes('Instructor')) {
          professor = li.innerText.split(':')[1].trim();
        }
        if (detailLabelText.includes('Description')) {
          title = li.innerText.split(':')[1].split('(')[0].trim();
        }
      });
      // append professor name to the table
      const newTd = document.createElement('td');
      newTd.innerText = professor ?? 'No Instructor';
      const newButtonTd = document.createElement('td');
      const newButton = document.createElement('button');
      newButtonTd.appendChild(newButton);
      newButton.style.background = '#E98300';
      newButton.style.color = '#000';
      newButton.style.border = 'none';
      newButton.style.borderRadius = '5px';
      newButton.style.padding = '10px';
      newButton.style.margin = '10px';
      newButton.innerText = 'Save';
      // this is in case we have multiple instructions per section
      const sectionProfessors = professor.split(',');
      sectionProfessors.forEach((sectionProfessor) => {
        professors.push(sectionProfessor.trim());
      });
      const courseRowCells = courseRow.querySelector('tr');
      const times =
        courseRowCells.children[courseRowCells.children.length - 1].textContent;
      courseRowCells.insertBefore(newTd, courseRowCells.children[7]);
      console.log(title);

      const semesters = {
        S25: {
          firstMonthOfSemester: '01',
          firstMondayOfSemester: 21,
          lastMonthOfSemester: '05',
          lastFridayOfSemester: 15,
        },
        F25: {
          firstMonthOfSemester: '08',
          firstMondayOfSemester: 21,
          lastMonthOfSemester: '12',
          lastFridayOfSemester: 15,
        },
      };
      const semester = semesters.S25;
      console.log('semester');

      // parse
      const monday = semester.firstMondayOfSemester;
      const tuesday = semester.firstMondayOfSemester + 1;
      const wednesday = semester.firstMondayOfSemester + 2;

      let day1 = null;
      let day2 = null;
      const splitTimes = times.split(' ');
      if (splitTimes[0] == 'MW') {
        day1 = monday;
        day2 = wednesday;
      } else if (splitTimes[0] == 'TTh') {
        day1 = tuesday;
        day2 += tuesday + 2;
      } else if (splitTimes[0] == 'F') {
        day1 = wednesday + 2;
      } else if (splitTimes[0] == 'W') {
        day1 = wednesday;
      }
      let startTime = splitTimes[1].replace('am', '');
      let endTime = splitTimes[3].replace('am', '');
      if (startTime.includes('pm')) {
        startTime = startTime.replace('pm', '');
        const startTimeNum = Number(startTime.split(':')[0]);
        startTime =
          (
            Number(startTime.split(':')[0]) + (startTimeNum !== 12 ? 12 : 0)
          ).toString() +
          ':' +
          startTime.split(':')[1];
      }
      if (endTime.includes('pm')) {
        endTime = endTime.replace('pm', '');
        const endTimeNum = Number(endTime.split(':')[0]);
        endTime =
          (
            Number(endTime.split(':')[0]) + (endTimeNum !== 12 ? 12 : 0)
          ).toString() +
          ':' +
          endTime.split(':')[1];
      }
      const event1 = {
        summary: title,
        organization: 'Class from Skedge',
        start: {
          dateTime: `2025-${semester.firstMonthOfSemester}-${day1}T${startTime}:00-06:00`,
          timeZone: 'America/Chicago',
        },
        end: {
          dateTime: `2025-${semester.firstMonthOfSemester}-${day1}T${endTime}:00-06:00`,
          timeZone: 'America/Chicago',
        },
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=2025${semester.lastMonthOfSemester}${semester.lastFridayOfSemester}T170000Z`,
        ],
        pid: 0,
      };
      const event2 = {
        summary: title,
        organization: 'Class from Skedge',
        start: {
          dateTime: `2025-${semester.firstMonthOfSemester}-${day2}T${startTime}:00-06:00`,
          timeZone: 'America/Chicago',
        },
        end: {
          dateTime: `2025-${semester.firstMonthOfSemester}-${day2}T${endTime}:00-06:00`,
          timeZone: 'America/Chicago',
        },
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=2025${semester.lastMonthOfSemester}${semester.lastFridayOfSemester}T170000Z`,
        ],
        pid: 0,
      };

      chrome.storage.local.get('token', async function (tokenStored) {
        if (typeof tokenStored.token !== 'undefined') {
          newButton.onclick = async () => {
            chrome.runtime.sendMessage({
              name: 'insertEventToGoogleCalendar',
              event: event1,
              token: tokenStored.token,
            });
            if (event2) {
              chrome.runtime.sendMessage({
                name: 'insertEventToGoogleCalendar',
                event: event2,
                token: tokenStored.token,
              });
            }
            alert(`Added ${event1.summary} to calendar.`);
          };
          courseRowCells.insertBefore(newButton, courseRowCells.children[1]);
        }
      });

      //Increase Disabled Reasons row colspan if necessary
      const sectionDisabled = courseRow.querySelector(
        'tr:nth-child(3) > td',
      ) as HTMLTableCellElement | null;
      if (sectionDisabled !== null) {
        sectionDisabled.colSpan = sectionDisabled.colSpan + 1;
      }
      // collapse section details
      sectionDetailsButton.click();
    });
    return professors;
  }
}

const realBrowser = process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;
/** This listens for clicks on the buttons that switch between the enabled and disabled professor tabs and reports back to background.ts */
export function listenForTableChange() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        //button corresponding to shown table is given an active class
        if ((mutation.target as Element).classList.contains('active')) {
          // @ts-expect-error:next-line
          realBrowser.runtime.sendMessage('tableChange');
        }
      }
    }
  });
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
  });
  //remove observer when ordered by backgroud.ts to avoid duplicates
  realBrowser.runtime.onMessage.addListener(function (message) {
    if (message === 'disconnectObserver') {
      observer.disconnect();
    }
  });
}
