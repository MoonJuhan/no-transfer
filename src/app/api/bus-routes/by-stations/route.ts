import { ApiGetRouteByStationResponse, ApiGetStaionByRouteResponse, PublicTransportationRoute } from '@/types'

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

    const refineRoute = ({ busRouteId, busRouteNm }: ApiGetRouteByStationResponse) => ({
      id: busRouteId,
      name: busRouteNm,
    })

    return json.msgBody.itemList.map(refineRoute)
  }

  const fetchStationsByBusRouteId = async (busRouteId: string, searchParams: URLSearchParams) => {
    const response = await fetch(
      `http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute?busRouteId=${busRouteId}&${searchParams.toString()}`,
    )
    const json = await response.json()

    const refineStation = ({ arsId, stationNm, gpsX, gpsY }: ApiGetStaionByRouteResponse) => ({
      id: arsId,
      name: stationNm,
      gpsX,
      gpsY,
    })

    return { busRouteId, stations: json.msgBody.itemList.map(refineStation) }
  }

  try {
    const routesResponse = await Promise.all(arsIds.map((arsId) => fetchRoutesByArsId(arsId, searchParams)))

    const filteredRoutes = routesResponse
      .flat()
      .filter(
        ({ id }: PublicTransportationRoute, index: number, arr: PublicTransportationRoute[]) =>
          arr.findIndex((r) => r.id === id) === index,
      )

    const busRouteIds = filteredRoutes.map(({ id }: PublicTransportationRoute) => id)

    const stationsResponse = await Promise.all(
      busRouteIds.map((busRouteId) => fetchStationsByBusRouteId(busRouteId, searchParams)),
    )

    return new Response(
      JSON.stringify({
        data: filteredRoutes.map((route: PublicTransportationRoute) => ({
          ...route,
          stations: stationsResponse.find(({ busRouteId }) => busRouteId === route.id)?.stations || [],
        })),
      }),
      { status: 200 },
    )
  } catch (error) {
    return error
  }
}
