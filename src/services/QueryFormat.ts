import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type BoolType = {
  bool?: {
    must?: any[];
    should?: any[];
  };
};

export function parseElasticsearchQuery(originalInput: string): QueryDslQueryContainer {
  const input = formatQuery(originalInput);
  const stack: BoolType[] = [];
  let current: BoolType = {};
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char === '(') {
      // Verifique o próximo operador
      let nextOperator = '|'; // Default operator is OR
      let j = i + 1;
      while (j < input.length) {
        if (input[j] === '|' || input[j] === '&') {
          nextOperator = input[j];
          break;
        }
        j++;
      }
      if (nextOperator === '|') {
        current = { bool: { should: [] } };
        stack.push(current);
      } else if (nextOperator === '&') {
        current = { bool: { must: [] } };
        stack.push(current);
      }

      let x = j + 1;
      while (x < input.length) {
        if (input[x] === '(') {
          const top = stack.pop();
          if (current?.bool?.should) {
            top?.bool?.should?.push({ bool: { should: [] } });
          } else if (current?.bool?.must) {
            top?.bool?.must?.push({ bool: { must: [] } });
          }
          stack.push(current);
          current = top ? top : {};
          break;
        }
        x++;
      }
      // i = j; // Avança para o próximo operador
      i++;
    } else if (char === ')') {
      if (stack.length === 0) {
        console.error('String de busca mal formatada: ', originalInput);
        throw new Error('String de busca mal formatada.');
        // i++;
        // continue;
      }
      const top = stack.pop();
      if (top?.bool?.should) {
        top.bool.should.push(current);
      } else if (top?.bool?.must) {
        top.bool.must.push(current);
      }
      current = top ? top : {};
      i++;
    } else {
      if (char === '|' || char === '&') {
        i++;
        continue;
      }
      const indexOr = input.indexOf('|', i);
      const indexAnd = input.indexOf('&', i);

      let index = getMinValidIndex([indexOr, indexAnd]);

      const fields = [];

      if (index > i) {
        fields.push(input.substring(i, index));
      }
      let nextIndex = index + 1;
      const chars = ['|', '&', ')', '('];

      if (fields.length > 0 && !chars.includes(input.charAt(nextIndex))) {
        for (nextIndex; nextIndex < input.length && !chars.includes(input.charAt(nextIndex)); index++) {
          const nexIndexOr = input.indexOf('|', nextIndex);
          const nextIndexAnd = input.indexOf('&', nextIndex);
          const nextIndexOpenPar = input.indexOf('(', nextIndex);
          const nextIndexClosePar = input.indexOf(')', nextIndex);
          const nextNextIndex = getMinValidIndex([nexIndexOr, nextIndexAnd, nextIndexOpenPar, nextIndexClosePar]);
          if (nextNextIndex > 0) {
            index = nextNextIndex - 1;
            fields.push(input.substring(nextIndex, nextNextIndex));
            nextIndex = nextNextIndex;
          }
        }
      }

      if (fields.length > 0) {
        fields.forEach((field) => {
          if (current?.bool?.must) {
            if (
              current.bool.must &&
              current.bool.must[0] &&
              current.bool.must[0].bool &&
              current.bool.must[0].bool.must
            ) {
              current.bool.must[0].bool.must.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            } else {
              current.bool.must.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            }
          } else if (current?.bool?.should) {
            if (
              current.bool.should &&
              current.bool.should[0] &&
              current.bool.should[0].bool &&
              current.bool.should[0].bool.should
            ) {
              current.bool.should[0].bool.should.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            } else {
              current.bool.should.push({
                match: {
                  [field.split('=')[0]]: field.split('=')[1],
                },
              });
            }
          }
        });
      }

      index > i ? (i = index) : i++;
    }
  }

  if (stack.length !== 0) {
    console.error('String de busca mal formatada: ', originalInput);
    throw new Error('String de busca mal formatada.');
  }

  let fullQuery = stringify(current);
  fullQuery = fullQuery.replace(',null', '');
  return JSON.parse(fullQuery);
}

function getMinValidIndex(list: number[]) {
  return Math.min(...list.map((value) => (value >= 0 ? value : Infinity)));
}

function stringify(obj: object) {
  let cache: any = [];
  const str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

function formatQuery(originalQuery: string) {
  const cleanQuery = originalQuery.replaceAll(' ', '');
  let subQuerys = cleanQuery.split(')');
  if (subQuerys.length <= 2) {
    return cleanQuery;
  }
  subQuerys.pop();

  for (let index = 0; index < subQuerys.length; index++) {
    subQuerys[index] = subQuerys[index].replaceAll('(', '');
    subQuerys[index] = subQuerys[index].replaceAll(')', '');
    if (subQuerys[index].charAt(0) == '|' || subQuerys[index].charAt(0) == '&') {
      const primeiroCaractere = subQuerys[index].charAt(0);
      const restoDaString = subQuerys[index].slice(1);
      subQuerys[index] = restoDaString + primeiroCaractere;
    }
  }

  let query = '';

  subQuerys = subQuerys.reverse();

  for (let index = 0; index < subQuerys.length; index++) {
    query += `(${subQuerys[index]}`;
  }

  for (let index = 0; index < subQuerys.length; index++) {
    query += ')';
  }
  return query;
}
