import { sendToBackground } from '@plasmohq/messaging';
import type { ShowCourseTabPayload } from '~background';
import CourseOverview from '~components/CourseOverview';
import Landing from '~components/Landing';
import ProfessorOverview from '~components/ProfessorOverview';
import SearchResultsTable from '~components/SearchResultsTable';
import TopMenu from '~components/TopMenu';
import { SCHOOL_ID, SCHOOL_NAME, TRENDS_URL } from '~data/config';
import fetchFromRmp, { type RMPInterface } from '~data/fetchFromRmp';
import fetchWithCache, {
  cacheIndexGrades,
  expireTime,
} from '~data/fetchWithCache';
import type { GenericFetchedData } from '~types/GenericFetchedData';
import type { GradesData, GradesType } from '~types/GradesType';
import {
  convertToProfOnly,
  searchQueryEqual,
  searchQueryLabel,
  type SearchQuery,
} from '~types/SearchQuery';
import React, { useEffect, useState } from 'react';

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
  let mean_gpa = -1;
  if (total !== 0) {
    mean_gpa =
      GPALookup.reduce(
        (accumulator, currentValue, index) =>
          accumulator + currentValue * grade_distribution[index],
        0,
      ) /
      (total - grade_distribution[grade_distribution.length - 1]);
  }

  let median_gpa = -1;
  let medianIndex = -1;
  if (total != 0) {
    let i = Math.floor(total / 2);
    while (i > 0) {
      medianIndex++;
      i -= grade_distribution[medianIndex];
    }
    median_gpa = GPALookup[medianIndex];
  }

  return {
    mean_gpa: mean_gpa,
    gpa: median_gpa,
    total: total,
    grade_distribution: grade_distribution,
  };
}
//Fetch grades by academic session from nebula api
function fetchGradesData(course: SearchQuery): Promise<GradesType> {
  return fetchWithCache(
    TRENDS_URL +
      'api/grades?' +
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
    cacheIndexGrades,
    expireTime,
  ).then((response: { message: string; data: GradesData }) => {
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
  return fetchFromRmp(
    professor.profFirst,
    professor.profLast,
    SCHOOL_ID,
    SCHOOL_NAME,
  ).then((response) => {
    if (typeof response === 'string') {
      throw new Error(response);
    }
    if (response.message !== 'success') {
      throw new Error(response.message);
    }
    return response.data;
  });
}

// Example of how to fetch the scraped data from the background script, given that it exists
async function getCourseData() {
  const response: ShowCourseTabPayload = await sendToBackground({
    // See https://docs.plasmo.com/framework/messaging#3-generate-static-types
    // @ts-expect-error:next-line
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
  const [header, setHeader] = useState<string | SearchQuery>('');

  const [results, setResults] = useState<SearchQuery[]>([]);

  useEffect(() => {
    getCourseData().then((payload) => {
      if (payload === null) {
        setPage('landing');
        return;
      }
      setPage('list');
      setHeader(payload.header);
      console.log(payload.header, typeof payload.header);
      if (typeof payload.header !== 'string') {
        fetchAndStoreGradesData(payload.header);
      }
      setResults(removeDuplicates(payload.professors));
      getData(payload.professors);
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
              'h-fit bg-[rgb(246,246,246)] dark:bg-black' +
              (page !== 'list' ? ' hidden' : '')
            }
          >
            <div className="p-4">
              <CourseOverview
                header={header}
                grades={
                  typeof header !== 'string'
                    ? grades[searchQueryLabel(header)]
                    : undefined
                }
              />
            </div>
            <SearchResultsTable
              results={results}
              grades={grades}
              rmp={rmp}
              setPage={setPageAndScroll}
              showProfNameOnly={typeof header !== 'string'}
              fallbackToProfOnly={typeof header !== 'string'}
            />
          </div>
          {page !== 'list' && (
            <div className="h-fit min-h-full p-4 bg-[rgb(246,246,246)] dark:bg-black">
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
