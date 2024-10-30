export type SearchQuery = {
  prefix?: string;
  number?: string;
  profFirst?: string;
  profLast?: string;
};

export type Professor = {
  profFirst: string;
  profLast: string;
};

export type Course = {
  prefix: string;
  number: string;
};

export function convertToProfOnly(
  searchQuery: SearchQuery,
): Professor | Record<string, never> {
  if (!('profFirst' in searchQuery && 'profLast' in searchQuery)) {
    return {};
  }
  return {
    profFirst: searchQuery.profFirst as string,
    profLast: searchQuery.profLast as string,
  };
}

export function convertToCourseOnly(
  searchQuery: SearchQuery,
): Course | Record<string, never> {
  if (!('prefix' in searchQuery && 'number' in searchQuery)) {
    return {};
  }
  return {
    prefix: searchQuery.prefix as string,
    number: searchQuery.number as string,
  };
}

export function searchQueryLabel(query: SearchQuery): string {
  let result = '';
  if (typeof query.prefix !== 'undefined') {
    result += query.prefix;
  }
  if (typeof query.number !== 'undefined') {
    result += ' ' + query.number;
  }
  if (
    typeof query.profFirst !== 'undefined' &&
    typeof query.profLast !== 'undefined'
  ) {
    result += ' ' + query.profFirst + ' ' + query.profLast;
  }
  return result.trim();
}

export function searchQueryEqual(
  query1: SearchQuery,
  query2: SearchQuery,
): boolean {
  if (query1.prefix !== query2.prefix) {
    return false;
  }
  if (
    query1.profFirst !== query2.profFirst ||
    query1.profLast !== query2.profLast
  ) {
    return false;
  }
  if (query1.number !== query2.number) {
    return false;
  }
  return true;
}
