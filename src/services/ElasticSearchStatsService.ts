/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async () => {
  const response = await fetch('/api/index-stats')
  return response.json()
}

export default proxy
