const indexes = [
  { text: 'publications', name: process.env.INDEX_PUBLICATION || '' },
  { text: 'people', name: process.env.INDEX_PERSON || '' },
  { text: 'journals', name: process.env.INDEX_JOURNAL || '' },
  { text: 'organizations', name: process.env.INDEX_ORGUNIT || '' },
  { text: 'patents', name: process.env.INDEX_PATENT || '' },
  { text: 'programs', name: process.env.INDEX_PROGRAM || '' },
  { text: 'research groups', name: process.env.INDEX_GROUP || '' },
  { text: 'softwares', name: process.env.INDEX_SOFTWARE || '' },
];

export default indexes;
