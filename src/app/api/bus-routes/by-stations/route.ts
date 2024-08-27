export async function GET(request: Request) {
  const url = new URL(request.url)
  const arsIds = url.searchParams.get('arsIds')?.split(',') || []

  if (arsIds.length === 0) {
    return new Error('arsIds is empty')
  }

  const searchParams = new URLSearchParams()

  const serviceKey = process.env.NEXT_PUBLIC_OPEN_API_KEY as string

  searchParams.append('serviceKey', serviceKey)
  searchParams.append('resultType', 'json')

  const fetchRoutesByArsId = async (arsId: string, searchParams: URLSearchParams) => {
    const response = await fetch(
      `http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation?arsId=${arsId}&${searchParams.toString()}`,
    )
    const json = await response.json()
    const routes = json.msgBody.itemList
    return { arsId, routes }
  }

  try {
    const responses = await Promise.all(arsIds.map((arsId) => fetchRoutesByArsId(arsId, searchParams)))

    return new Response(JSON.stringify(responses), { status: 200 })
  } catch (error) {
    return error
  }
}
