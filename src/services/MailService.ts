/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (body: string) => {
  console.log('body: ', body)
  const response = await fetch('/api/mail', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: body,
  })
  console.log('response: ', response)
  return response
}

export default proxy
