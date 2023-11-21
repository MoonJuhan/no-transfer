import { json } from '@sveltejs/kit'
import axios from 'axios'

export async function GET({ url }) {
	console.log('GET /api/bus_routes')

	const stationIds = url.searchParams.get('stationIds')

	if (!stationIds) {
		// res.status(400).json({
		// 	status: 'error',
		// 	error: 'query is empty',
		// })

		// return Error
		return json({})
	}

	const getAllBusRoutes = async (stationIdList) => {
		try {
			const serviceKey = process.env.OPEN_API_KEY

			const routes = await Promise.all(
				stationIdList.map(async (arsId) => {
					try {
						const { data } = await axios.get('http://ws.bus.go.kr/api/rest/stationinfo/getRouteByStation', {
							params: {
								serviceKey,
								arsId,
								resultType: 'json',
							},
						})

						if (!data) return { arsId, status: 'error' }

						return { arsId, busRoutes: data.msgBody.itemList || [] }
					} catch (error) {
						return { arsId, status: 'error' }
					}
				}),
			)

			return routes
		} catch (error) {
			return Promise.reject(error)
		}
	}

	try {
		const response = await getAllBusRoutes(stationIds.split(','))

		return json(response)
	} catch (error) {
		console.log(error)
		// return Error
		return json({})
	}
}
