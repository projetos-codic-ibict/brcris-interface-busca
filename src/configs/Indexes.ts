const indexes = [
  { label: 'publications', name: process.env.INDEX_PUBLICATION || '' },
  { label: 'people', name: process.env.INDEX_PERSON || '' },
  { label: 'journals', name: process.env.INDEX_JOURNAL || '' },
  { label: 'organizations', name: process.env.INDEX_ORGUNIT || '' },
  { label: 'patents', name: process.env.INDEX_PATENT || '' },
  { label: 'programs', name: process.env.INDEX_PROGRAM || '' },
  { label: 'research groups', name: process.env.INDEX_GROUP || '' },
  { label: 'software', name: process.env.INDEX_SOFTWARE || '' },
];

export default indexes;
