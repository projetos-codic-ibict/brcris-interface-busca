const proxy = async (querys: string[], index: string) => {
  const body = JSON.stringify({ querys, index });
  const response = await fetch('/api/indicators', {
    method: 'POST',

    body: body,
  });
  return response.json();
};

export default proxy;
