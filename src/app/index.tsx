import { sendToBackground } from '@plasmohq/messaging';
import type { ShowCourseTabPayload } from '~background';
import CourseOverview from '~components/CourseOverview';
import Landing from '~components/Landing';
import ProfessorOverview from '~components/ProfessorOverview';
import SearchResultsTable from '~components/SearchResultsTable';
import TopMenu from '~components/TopMenu';
import { type RMPInterface } from '~data/fetchFromRmp';
import { fetchGradesData, fetchRmpData } from '~data/fetchGradesData';
import type { GenericFetchedData } from '~types/GenericFetchedData';
import type { GradesType } from '~types/GradesType';
import {
  convertToProfOnly,
  searchQueryEqual,
  searchQueryLabel,
  type SearchQuery,
} from '~types/SearchQuery';
import React, { useEffect, useState } from 'react';

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
              'h-fit bg-light dark:bg-dark' + (page !== 'list' ? ' hidden' : '')
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
            <div className="h-fit min-h-full p-4 bg-light dark:bg-dark">
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
