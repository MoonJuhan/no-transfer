import { json } from '@sveltejs/kit'
import axios from 'axios'

export async function GET({ url }) {
	console.log('GET /bus-stations')

	const tmX = url.searchParams.get('tmX')
	const tmY = url.searchParams.get('tmY')
	const radius = url.searchParams.get('radius')

	if (!tmX || !tmY) {
		return json(
			{
				status: 'error',
				error: 'query is empty',
			},
			{ status: 400 },
		)
	}

	try {
		const serviceKey = process.env.OPEN_API_KEY

		const { data } = await axios.get('http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos', {
			params: {
				serviceKey,
				tmX,
				tmY,
				radius: radius || 500,
				resultType: 'json',
			},
		})

		return json(data.msgBody.itemList)
	} catch (error) {
		return json(error, { status: 400 })
	}
}
