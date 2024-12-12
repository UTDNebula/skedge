import type { PlasmoCSConfig } from 'plasmo';

import { type SearchQuery } from '~utils/SearchQuery';

// Plasmo CS config export
export const config: PlasmoCSConfig = {
  matches: [
    'https://utdallas.collegescheduler.com/terms/*/courses/*',
    'https://utdallas.collegescheduler.com/terms/*/currentschedule',
    'https://utdallas.collegescheduler.com/terms/*/schedules',
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
  const [header, professors] = await Promise.all([
    getHeader(),
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

  /** Gets the header or course prefix and number from the page */
  async function getHeader(): Promise<string | SearchQuery> {
    const header = (await waitForElement('h1')).innerText.trim();
    if (header.match(/^[a-zA-Z]{2,4} [0-9][0-9V]?[0-9]{0,2}$/)) {
      // is course
      const courseData = header.split(' ');
      return { prefix: courseData[0], number: courseData[1] };
    }
    // is text
    return header;
  }

  /** Gets all professor names and then injects them into the section table */
  async function injectAndGetProfessorNames(): Promise<SearchQuery[]> {
    const professors: SearchQuery[] = [];
    const courseTable = await waitForElement('table');
    const courseRows = courseTable.querySelectorAll('tbody');

    // find place
    const tableHeaders = courseTable.querySelector('thead > tr');
    let sectionPlace;
    for (
      sectionPlace = 0;
      sectionPlace < tableHeaders.children.length;
      sectionPlace++
    ) {
      if (
        (tableHeaders.children[sectionPlace] as HTMLElement).innerText ===
        'Section'
      ) {
        break;
      }
    }
    sectionPlace++;

    if (!courseTable.querySelector('[data-skedge="th"]')) {
      // add Professor header to the table
      const newHeader = document.createElement('th');
      newHeader.setAttribute('data-skedge', 'th');
      const line1 = document.createElement('div');
      line1.innerText = 'Instructor(s)';
      newHeader.append(line1);
      // add Skedge reminder
      const line2 = document.createElement('div');
      line2.style.fontWeight = 'normal';
      line2.style.paddingTop = '0.5rem';
      line2.innerText = 'From Skedge';
      newHeader.append(line2);
      tableHeaders.insertBefore(newHeader, tableHeaders.children[sectionPlace]);
    }

    courseRows.forEach((courseRow) => {
      // get professor name from course row
      const sectionDetailsButton =
        courseRow.querySelector<HTMLButtonElement>('tr > td > button');
      // expand section details to load the details
      sectionDetailsButton.click();
      const sectionDetails = courseRow.querySelector('tr:nth-child(2)');
      const sectionDetailsList = sectionDetails.querySelectorAll('li');
      const searchQuery: SearchQuery = {};
      let professor;
      sectionDetailsList.forEach((li) => {
        const detailLabelText =
          li.querySelector<HTMLElement>('strong > span').innerText;
        if (detailLabelText.includes('Subject')) {
          searchQuery.prefix = li.innerText.split(':')[1].trim();
        }
        if (detailLabelText.includes('Course')) {
          searchQuery.number = li.innerText.split(':')[1].trim();
        }
        if (detailLabelText.includes('Instructor')) {
          professor = li.innerText.split(':')[1].trim();
        }
      });
      // append professor name to the table
      const courseRowCells = courseRow.querySelector('tr');
      let newTd = courseRowCells.querySelector(
        '[data-skedge="td"]',
      ) as HTMLElement;
      if (!newTd) {
        newTd = document.createElement('td');
        newTd.setAttribute('data-skedge', 'td');
        courseRowCells.insertBefore(
          newTd,
          courseRowCells.children[sectionPlace],
        );
        //Increase Disabled Reasons row colspan if necessary
        const sectionDisabled = courseRow.querySelector(
          'tr:nth-child(3) > td',
        ) as HTMLTableCellElement | null;
        if (sectionDisabled !== null) {
          sectionDisabled.colSpan = sectionDisabled.colSpan + 1;
        }
      }
      newTd.innerText = professor ?? 'No Instructor';
      if (typeof professor !== 'undefined') {
        // this is in case we have multiple instructions per section
        const sectionProfessors = professor.trim().split(',');
        sectionProfessors.forEach((sectionProfessor) => {
          const splitProf = sectionProfessor.trim().split(' ');
          professors.push({
            ...searchQuery,
            profFirst: splitProf[0],
            profLast: splitProf[splitProf.length - 1],
          });
        });
      }
      // collapse section details
      sectionDetailsButton.click();
    });
    return professors;
  }
}

/** This listens for clicks on the buttons that switch between the enabled and disabled professor tabs and reports back to background.ts */
export function listenForTableChange() {
  const realBrowser =
    process.env.PLASMO_BROWSER === 'chrome' ? chrome : browser;
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

export async function addGCalButtons() {
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

  const courseTable = await waitForElement('table');

  // add Save to Google Calendar
  const newHeader = document.createElement('th');
  const line1 = document.createElement('div');
  line1.innerText = 'Save to \nGoogle Calendar';
  newHeader.append(line1);
  // add Skedge reminder
  const line2 = document.createElement('div');
  line2.style.fontWeight = 'normal';
  line2.style.paddingTop = '0.5rem';
  line2.innerText = 'From Skedge';
  newHeader.append(line2);
  const tableHeaders = courseTable.querySelector('thead > tr');
  tableHeaders.insertBefore(newHeader, tableHeaders.children[1]);

  const courseRows = courseTable.querySelectorAll('tbody');
  const newTds = [];
  courseRows.forEach((courseRow) => {
    const newTd = document.createElement('td');
    newTds.push(newTd);
    const courseRowCells = courseRow.querySelector('tr');
    courseRowCells.insertBefore(newTd, courseRowCells.children[1]);
  });

  // automatically fetch current term from page URL
  const termString = window.location.toString().split('terms/')[1].split('/')[0];
  let courses = await fetch(
    'https://utdallas.collegescheduler.com/api/term-data/' + termString,
  );
  courses = (await courses.json()).currentSections;

  if (typeof courses !== 'undefined') {
    for (let i = 0; i <= newTds.length; i++) {
      // append button to the table
      const newTd = newTds[i];
      const courseData = courses[i];
      const links = []; // each metting
      for (let j = 0; j < courseData.meetings.length; j++) {
        const meeting = courseData.meetings[j];
        const formatTime = (date, time) => {
          const datePart = new Date(date);
          const timePart = String(time).padStart(4, '0');
          const hours = parseInt(timePart.slice(0, 2), 10);
          const minutes = parseInt(timePart.slice(2), 10);
          datePart.setUTCHours(hours, minutes, 0, 0);
          return `${datePart.toISOString().replace(/[-:]/g, '').split('.')[0]}`;
        };
        const formattedStartDate = formatTime(
          meeting.startDate,
          meeting.startTime,
        );
        const formattedEndTime = formatTime(meeting.startDate, meeting.endTime);
        const recurrenceEnd =
          meeting.endDate.split('T')[0].replaceAll('-', '') + 'T235959';
        const meetingDays = meeting.days
          .replaceAll('Th', 'X')
          .split('')
          .map(
            (letter) =>
              ({ M: 'MO', T: 'TU', W: 'WE', X: 'TH', F: 'FR' })[letter],
          )
          .join(',');
        const recurrence = `RRULE:FREQ=WEEKLY;UNTIL=${recurrenceEnd};BYDAY=${meetingDays}`;
        links.push(
          `https://calendar.google.com/calendar/r/eventedit?text=${courseData.subject} ${courseData.course}&dates=${formattedStartDate}/${formattedEndTime}&ctz=America/Chicago&location=${meeting.building}&recur=${recurrence}`,
        );
      }
      // make a button to open multiple links at once when necessaary
      let newLink;
      if (links.length > 1) {
        newLink = document.createElement('button');
        newLink.innerText = 'Add to Calendar (' + links.length + ')';
        newLink.onclick = function () {
          for (const link of links) {
            window.open(link);
          }
        };
      } else {
        newLink = document.createElement('a');
        newLink.innerText = 'Add to Calendar';
        newLink.target = '_blank';
        newLink.href = links[0];
      }
      newLink.style.background = '#E98300';
      newLink.style.color = '#000';
      newLink.style.border = 'none';
      newLink.style.borderRadius = '4px';
      newLink.style.padding = '6px 12px';
      newLink.style.margin = '10px auto';
      newLink.style.display = 'block';
      newTd.appendChild(newLink);
    }
  }
}
