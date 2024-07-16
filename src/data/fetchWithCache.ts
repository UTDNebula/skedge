import { Storage } from '@plasmohq/storage';

const storage = new Storage({
  area: 'local',
});

//Increment these to reset cache on next deployment
export const cacheIndexProfessor = 0;
export const cacheIndexGrades = 0;
export const cacheIndexRmp = 0;

function getCache(key: string, cacheIndex: number) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'development') {
      storage
        .get(key)
        .then((item) => {
          if (typeof item !== 'undefined') {
            const parsedItem = JSON.parse(item);
            if (
              !('cacheIndex' in parsedItem) ||
              cacheIndex !== parsedItem.cacheIndex ||
              !('expiry' in parsedItem) ||
              new Date().getTime() > parsedItem.expiry ||
              !('value' in parsedItem)
            ) {
              storage.remove(key);
              resolve(false);
            } else {
              resolve(parsedItem.value);
            }
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      resolve(false);
    }
  });
}

function setCache(
  key: string,
  cacheIndex: number,
  data: object,
  expireTime: number,
) {
  storage.set(
    key,
    JSON.stringify({
      value: data,
      expiry: new Date().getTime() + expireTime,
      cacheIndex: cacheIndex,
    }),
  );
}

function fetchWithCache(
  url: string,
  params: unknown,
  cacheIndex: number,
  expireTime: number,
  parseText: boolean = false,
) {
  const cacheKey = url + JSON.stringify(params);
  return getCache(cacheKey, cacheIndex)
    .then((cache) => {
      if (cache) {
        return cache;
      }
      return fetch(url, params)
        .then((response) => {
          if (parseText) {
            return response.text();
          }
          return response.json();
        })
        .then((data) => {
          setCache(cacheKey, cacheIndex, data, expireTime);
          return data;
        });
    })
    .catch((error) => {
      console.error(error);
    });
}
export default fetchWithCache;
