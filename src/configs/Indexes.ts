const indexes = [
  { text: 'Publications', page: 'publications', name: process.env.INDEX_PUBLICATION || '' },
  { text: 'People', page: 'people', name: process.env.INDEX_PERSON || '' },
  { text: 'Journals', page: 'journals', name: process.env.INDEX_JOURNAL || '' },
  { text: 'Institutions', page: 'institutions', name: process.env.INDEX_ORGUNIT || '' },
  { text: 'Patents', page: 'patents', name: process.env.INDEX_PATENT || '' },
  { text: 'PPGs', page: 'programs', name: process.env.INDEX_PROGRAM || '' },
  { text: 'Research Groups', page: 'groups', name: process.env.INDEX_GROUP || '' },
  { text: 'Softwares', page: 'softwares', name: process.env.INDEX_SOFTWARE || '' },
];

export default indexes;
