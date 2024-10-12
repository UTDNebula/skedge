import { sendToBackground } from '@plasmohq/messaging';
import React, { useEffect, useState } from 'react';

import type { ShowCourseTabPayload } from '~background';
import CourseOverview from '~components/CourseOverview';
import Landing from '~components/Landing';
import ProfessorOverview from '~components/ProfessorOverview';
import SearchResultsTable from '~components/SearchResultsTable';
import TopMenu from '~components/TopMenu';
import type { RMPInterface } from '~data/fetchFromRmp';
import fetchWithCache, {
  cacheIndexNebula,
  cacheIndexRmp,
  expireTime,
} from '~data/fetchWithCache';
import type SearchQuery from '~utils/SearchQuery';
import {
  convertToProfOnly,
  searchQueryEqual,
  searchQueryLabel,
} from '~utils/SearchQuery';

type GenericFetchedDataError<T> = {
  state: 'error';
  data?: T;
};
type GenericFetchedDataLoading = {
  state: 'loading';
};
type GenericFetchedDataDone<T> = {
  state: 'done';
  data: T;
};
export type GenericFetchedData<T> =
  | GenericFetchedDataError<T>
  | GenericFetchedDataLoading
  | GenericFetchedDataDone<T>;

//Find GPA, total, and grade_distribution based on including some set of semesters
function calculateGrades(grades: GradesData, academicSessions?: string[]) {
  let grade_distribution = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const session of grades) {
    if (
      typeof academicSessions === 'undefined' ||
      academicSessions.includes(session._id)
    ) {
      grade_distribution = grade_distribution.map(
        (item, i) => item + session.grade_distribution[i],
      );
    }
  }

  const total: number = grade_distribution.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  const GPALookup = [
    4, 4, 3.67, 3.33, 3, 2.67, 2.33, 2, 1.67, 1.33, 1, 0.67, 0,
  ];
  let gpa = -1;
  if (total !== 0) {
    gpa =
      GPALookup.reduce(
        (accumulator, currentValue, index) =>
          accumulator + currentValue * grade_distribution[index],
        0,
      ) /
      (total - grade_distribution[grade_distribution.length - 1]);
  }

  return {
    gpa: gpa,
    total: total,
    grade_distribution: grade_distribution,
  };
}
type GradesData = {
  _id: string;
  grade_distribution: number[];
}[];
export type GradesType = {
  gpa: number;
  total: number;
  grade_distribution: number[];
  grades: GradesData;
};
//Fetch grades by academic session from nebula api
function fetchGradesData(course: SearchQuery): Promise<GradesType> {
  return fetchWithCache(
    'https://trends.utdnebula.com/api/grades?' +
      Object.keys(course)
        .map(
          (key) =>
            key +
            '=' +
            encodeURIComponent(String(course[key as keyof SearchQuery])),
        )
        .join('&'),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
    cacheIndexNebula,
    expireTime,
  ).then((response) => {
    if (response.message !== 'success') {
      throw new Error(response.message);
    }
    if (response.data == null) {
      throw new Error('null data');
    }
    return {
      ...calculateGrades(response.data),
      grades: response.data, //type GradesData
    };
  });
}

//Fetch RMP data from RMP
function fetchRmpData(professor: SearchQuery): Promise<RMPInterface> {
  return fetchWithCache(
    'https://trends.utdnebula.com/api/ratemyprofessorScraper?profFirst=' +
      encodeURIComponent(String(professor.profFirst)) +
      '&profLast=' +
      encodeURIComponent(String(professor.profLast)),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    },
    cacheIndexRmp,
    expireTime,
  ).then((response) => {
    if (response.message !== 'success') {
      throw new Error(response.message);
    }
    return response.data;
  });
}

// Example of how to fetch the scraped data from the background script, given that it exists
async function getCourseData() {
  const response: ShowCourseTabPayload = await sendToBackground({
    name: 'getScrapeData',
  });
  return response;
}

function removeDuplicates(array: SearchQuery[]) {
  return array.filter(
    (obj1, index, self) =>
      index === self.findIndex((obj2) => searchQueryEqual(obj1, obj2)),
  );
}

const Index = () => {
  const [page, setPage] = useState<'landing' | 'list' | SearchQuery>('landing');
  const [listScroll, setListScroll] = useState(0);
  function setPageAndScroll(set: 'landing' | 'list' | SearchQuery) {
    if (set === 'list') {
      //give time to render then scroll back down to last position
      setTimeout(() => window.scrollTo({ top: listScroll }), 0);
    } else {
      //save scroll pos
      setListScroll(window.scrollY);
      window.scrollTo({ top: 0 });
    }
    setPage(set);
  }
  const [course, setCourse] = useState<SearchQuery>({});

  const [results, setResults] = useState<SearchQuery[]>([]);

  useEffect(() => {
    getCourseData().then((payload) => {
      if (payload === null) {
        setPage('landing');
        return;
      }
      setPage('list');
      const newCourse = {
        prefix: payload.header.subjectPrefix,
        number: payload.header.courseNumber,
      };
      setCourse(newCourse);
      fetchAndStoreGradesData(newCourse);
      let newResults = [];
      for (const professor of payload.professors) {
        const splitProf = professor.split(' ');
        const profFirst = splitProf[0];
        const profLast = splitProf[splitProf.length - 1];
        newResults.push({
          prefix: payload.header.subjectPrefix,
          number: payload.header.courseNumber,
          profFirst: profFirst,
          profLast: profLast,
        });
      }
      newResults = removeDuplicates(newResults);
      setResults(newResults);
      getData(newResults);
    });
  }, []);

  const [grades, setGrades] = useState<{
    [key: string]: GenericFetchedData<GradesType>;
  }>({});
  function addToGrades(key: string, value: GenericFetchedData<GradesType>) {
    setGrades((old) => {
      const newVal = { ...old };
      newVal[key] = value;
      return newVal;
    });
  }
  //Store rmp scores by profs
  const [rmp, setRmp] = useState<{
    [key: string]: GenericFetchedData<RMPInterface>;
  }>({});
  function addToRmp(key: string, value: GenericFetchedData<RMPInterface>) {
    setRmp((old) => {
      const newVal = { ...old };
      newVal[key] = value;
      return newVal;
    });
  }

  //Call fetchGradesData and store response
  function fetchAndStoreGradesData(course: SearchQuery) {
    addToGrades(searchQueryLabel(course), { state: 'loading' });
    fetchGradesData(course)
      .then((res: GradesType) => {
        //Add to storage
        //Set loading status to done, unless total was 0 in calculateGrades
        addToGrades(searchQueryLabel(course), {
          state: 'done',
          data: res,
        });
      })
      .catch((error) => {
        //Set loading status to error
        addToGrades(searchQueryLabel(course), { state: 'error' });
        console.error('Grades data for ' + searchQueryLabel(course), error);
      });
  }

  //Call fetchRmpData and store response
  function fetchAndStoreRmpData(professor: SearchQuery) {
    addToRmp(searchQueryLabel(professor), { state: 'loading' });
    fetchRmpData(professor)
      .then((res: RMPInterface) => {
        //Add to storage
        //Set loading status to done
        addToRmp(searchQueryLabel(professor), {
          state: typeof res !== 'undefined' ? 'done' : 'error',
          data: res,
        });
      })
      .catch((error) => {
        //Set loading status to error
        addToRmp(searchQueryLabel(professor), { state: 'error' });
        console.error('RMP data for ' + searchQueryLabel(professor), error);
      });
  }

  //On change to results, load new data
  function getData(results: SearchQuery[]) {
    //Grade data
    //Fetch each result
    for (const result of results) {
      fetchAndStoreGradesData(result);
    }

    //RMP data
    //Get list of profs from results
    //Remove duplicates so as not to fetch multiple times
    const professorsInResults = results
      //Remove course data from each
      .map((result) => convertToProfOnly(result))
      //Remove empty objects (used to be only course data)
      .filter((obj) => Object.keys(obj).length !== 0);
    //Fetch each professor
    for (const professor of professorsInResults) {
      fetchAndStoreRmpData(professor);
      fetchAndStoreGradesData(professor);
    }
  }

  return (
    <div className="w-[400px] h-[600px] text-haiti dark:text-white">
      {page === 'landing' && <Landing />}
      {page !== 'landing' && (
        <>
          <TopMenu />
          <div
            className={
              'h-fit dark:bg-black' + (page !== 'list' ? ' hidden' : '')
            }
          >
            <div className="p-4">
              <CourseOverview
                course={course}
                grades={grades[searchQueryLabel(course)]}
              />
            </div>
            <SearchResultsTable
              results={results}
              grades={grades}
              rmp={rmp}
              setPage={setPageAndScroll}
            />
          </div>
          {page !== 'list' && (
            <div className="h-fit min-h-full p-4 dark:bg-black">
              <ProfessorOverview
                professor={convertToProfOnly(page)}
                grades={grades[searchQueryLabel(convertToProfOnly(page))]}
                rmp={rmp[searchQueryLabel(convertToProfOnly(page))]}
                setPage={setPageAndScroll}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
