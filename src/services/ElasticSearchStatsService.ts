export function getIndexStats(indexText: string, setDocsCount: (count: string) => void, indexName: string) {
  const indexCount = localStorage.getItem(indexText);
  indexCount
    ? setDocsCount(indexCount)
    : proxy(indexName)
        .then((res) => {
          console.log('buscando remoto');
          const count = res['docs.count'];
          localStorage.setItem(indexText, count);
          setDocsCount(count);
        })
        .catch((err) => {
          console.error(err);
        });
}

const proxy = async (indexesName: string | string[]) => {
  const response = await fetch(`/api/index-stats?indexesName=${indexesName}`);
  return response.json();
};

export default proxy;
