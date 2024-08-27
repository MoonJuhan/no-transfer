import { ApiGetStationByPosResponse, Station } from '@/types'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const serviceKey = process.env.NEXT_PUBLIC_OPEN_API_KEY as string

  searchParams.append('serviceKey', serviceKey)
  searchParams.append('resultType', 'json')

  try {
    const response = await fetch(`http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const json = await response.json()

    const refineStation = ({ arsId, stationNm, gpsX, gpsY }: ApiGetStationByPosResponse) => ({
      id: arsId,
      stationName: stationNm,
      gpsX,
      gpsY,
    })

    return Response.json({ data: json.msgBody.itemList.map(refineStation).filter(({ id }: Station) => id !== '0') })
  } catch (error) {
    return error
  }
}
