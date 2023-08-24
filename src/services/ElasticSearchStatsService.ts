/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (indexName = '') => {
  const response = await fetch(`/api/index-stats?indexName=${indexName}`);
  return response.json();
};

export default proxy;
