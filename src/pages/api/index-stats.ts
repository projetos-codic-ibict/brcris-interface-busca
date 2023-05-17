/* eslint-disable @typescript-eslint/no-explicit-any */
const proxy = async (req: any, res: any) => {
  const response = await fetch(
    `${process.env.HOST_ELASTIC}/_cat/indices?format=json`
  )
  const data = await response.json()
  res.json(data)
}

export default proxy
