Promise.all([getCourseInfo(), injectAndGetProfessorNames()]).then(([courseData, professors]) => {
  console.log(courseData.subjectPrefix, courseData.courseNumber, professors);
});

export async function getCourseInfo() {
  const course = await waitForElement('h1');
  const courseData = course.innerText.split(" ");
  return { subjectPrefix: courseData[0], courseNumber: courseData[1] };
}

export function waitForElement(selector: string): Promise<HTMLElement> {
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

export async function injectAndGetProfessorNames(): Promise<string[]> {
  const courseTable = await waitForElement('table')
  const professors = [];
  const courseRows = courseTable.querySelectorAll('tbody');

  // add Professor header to the table
  const tableHeaders = courseTable.querySelector('thead > tr');
  const newHeader = document.createElement('th');
  newHeader.innerText = 'Professor';
  tableHeaders.insertBefore(newHeader, tableHeaders.children[7]);

  courseRows.forEach((courseRow) => {
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
    // append span element with professor as text to the newTd
    // const newSpan = document.createElement('span');
    // newSpan.innerText = professor;
    // newTd.appendChild(newSpan);
    const courseRowCells = courseRow.querySelector('tr');
    courseRowCells.insertBefore(newTd, courseRowCells.children[7]);

    // collapse section details
    sectionDetailsButton.click();
  });
  return [... new Set(professors)];
};