import { json } from '@sveltejs/kit'
import axios from 'axios'

export async function GET({ url }) {
	console.log('GET /api/bus_stations_by_route')

	const busRouteIds = url.searchParams.get('busRouteIds')

	if (!busRouteIds) {
		return json(
			{
				status: 'error',
				error: 'query is empty',
			},
			{ status: 400 },
		)
	}

	const getAllBusStations = async (busRouteIds) => {
		try {
			const serviceKey = process.env.OPEN_API_KEY

			const routes = await Promise.all(
				busRouteIds.map(async (busRouteId) => {
					try {
						const { data } = await axios.get('http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute', {
							params: {
								serviceKey,
								busRouteId,
								resultType: 'json',
							},
						})

						if (!data) return { busRouteId, status: 'error' }

						return { busRouteId, busStations: data.msgBody.itemList || [] }
					} catch (error) {
						return { busRouteId, status: 'error' }
					}
				}),
			)

			return routes
		} catch (error) {
			return Promise.reject(error)
		}
	}

	try {
		const response = await getAllBusStations(busRouteIds.split(','))

		return json(response)
	} catch (error) {
		return json(error, { status: 400 })
	}
}
