const englishFieldsMaps = new Map();
englishFieldsMaps.set('title_text', 'Title');
englishFieldsMaps.set('publicationDate', 'Year');
englishFieldsMaps.set('author.name', 'Autor');
englishFieldsMaps.set('language', 'Language');
englishFieldsMaps.set('type', 'Type');
englishFieldsMaps.set('orgunit.name', 'Institution');
englishFieldsMaps.set('keyword_text', 'Keyword');
englishFieldsMaps.set('name_text', 'Name');
englishFieldsMaps.set('status', 'Status');
englishFieldsMaps.set('leader.name', 'Leader');
englishFieldsMaps.set('member.name', 'Member');
englishFieldsMaps.set('country', 'Country');
englishFieldsMaps.set('state', 'State');
englishFieldsMaps.set('city', 'City');
englishFieldsMaps.set('issn', 'ISSN');
englishFieldsMaps.set('issnl', 'ISSN-L');
englishFieldsMaps.set('qualis', 'Qualis');
englishFieldsMaps.set('espacenetTitle_text', 'Title');
englishFieldsMaps.set('inventor.name', 'Inventor');
englishFieldsMaps.set('depositDate', 'Deposit year');
englishFieldsMaps.set('kindCode', 'Kind Code');
englishFieldsMaps.set('countryCode', 'Country code');
englishFieldsMaps.set('lattesId', 'Lattes');
englishFieldsMaps.set('orcid', 'Orcid');
englishFieldsMaps.set('releaseYear', 'Release year');
englishFieldsMaps.set('registrationCountry', 'Registration country');
englishFieldsMaps.set('platform', 'Platform');

const portugueseFieldsMaps = new Map();
portugueseFieldsMaps.set('title_text', 'Título');
portugueseFieldsMaps.set('publicationDate', 'Ano');
portugueseFieldsMaps.set('author.name', 'Autor');
portugueseFieldsMaps.set('language', 'Idioma');
portugueseFieldsMaps.set('type', 'Tipo');
portugueseFieldsMaps.set('orgunit.name', 'Instituição');
portugueseFieldsMaps.set('keyword_text', 'Palavra-chave');
portugueseFieldsMaps.set('name_text', 'Nome');
portugueseFieldsMaps.set('status', 'Status');
portugueseFieldsMaps.set('leader.name', 'Líder');
portugueseFieldsMaps.set('member.name', 'Membro');
portugueseFieldsMaps.set('country', 'País');
portugueseFieldsMaps.set('state', 'Estado');
portugueseFieldsMaps.set('city', 'Cidade');
portugueseFieldsMaps.set('issn', 'ISSN');
portugueseFieldsMaps.set('issnl', 'ISSN-L');
portugueseFieldsMaps.set('qualis', 'Qualis');
portugueseFieldsMaps.set('espacenetTitle_text', 'Título');
portugueseFieldsMaps.set('inventor.name', 'Inventor');
portugueseFieldsMaps.set('depositDate', 'Ano de depóstito');
portugueseFieldsMaps.set('kindCode', 'Tipo');
portugueseFieldsMaps.set('countryCode', 'Código do país');
portugueseFieldsMaps.set('lattesId', 'Lattes');
portugueseFieldsMaps.set('orcid', 'Orcid');
portugueseFieldsMaps.set('releaseYear', 'Ano de lançamento');
portugueseFieldsMaps.set('registrationCountry', 'País de registro');
portugueseFieldsMaps.set('platform', 'Plataforma');

export function getKeyByValue(searchValue: string, language = 'pt-br') {
  const map = language === 'pt-br' ? portugueseFieldsMaps : englishFieldsMaps;
  for (const [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
}

export function getValue(searchValue: string, language = 'pt-br') {
  const map = language === 'pt-br' ? portugueseFieldsMaps : englishFieldsMaps;
  return map.get(searchValue);
}
