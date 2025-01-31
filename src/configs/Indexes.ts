const indexes = [
  { text: 'Publications', name: process.env.INDEX_PUBLICATION || '' },
  { text: 'People', name: process.env.INDEX_PERSON || '' },
  { text: 'Journals', name: process.env.INDEX_JOURNAL || '' },
  { text: 'Institutions', name: process.env.INDEX_ORGUNIT || '' },
  { text: 'Patents', name: process.env.INDEX_PATENT || '' },
  { text: 'PPGs', name: process.env.INDEX_PROGRAM || '' },
  { text: 'Research Groups', name: process.env.INDEX_GROUP || '' },
  { text: 'Softwares', name: process.env.INDEX_SOFTWARE || '' },
];

export default indexes;
