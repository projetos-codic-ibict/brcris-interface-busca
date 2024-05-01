/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore

import en from 'public/locales/en/advanced.json';
// @ts-ignore
import ptBr from 'public/locales/pt-BR/advanced.json';

export function findPropertyByValue(value: string) {
  for (const property in ptBr) {
    //@ts-ignore
    if (ptBr[property] === value) {
      return property;
    }
  }
  for (const property in en) {
    //@ts-ignore
    if (en[property] === value) {
      return property;
    }
  }
  return value;
}

export function untranslatedFieldsNames(fullQuery: string) {
  const regex = /\(([^:)]+):/g; // pega os nomes dos campos, palavra entre '(' e ':'.

  const names = [];
  let name;
  while ((name = regex.exec(fullQuery))) {
    names.push(name[1]);
  }

  const map = new Map();
  names.forEach((name) => {
    console.log('name', name);
    const untranslated = findPropertyByValue(name);
    console.log('untranslated', untranslated);
    map.set(name, untranslated);
  });

  for (const [key, value] of map) {
    fullQuery = fullQuery.replaceAll(key, value);
  }
  console.log('fullQuery', fullQuery);
  return fullQuery;
}
