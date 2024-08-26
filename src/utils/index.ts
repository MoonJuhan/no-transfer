export function createCircleGeometry(longitude: number, latitude: number, radiusInMeters: number) {
  const points = 64

  const km = radiusInMeters / 1000
  const ret = []
  const distanceX = km / (111.32 * Math.cos((latitude * Math.PI) / 180))
  const distanceY = km / 110.574

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI)
    const x = distanceX * Math.cos(theta)
    const y = distanceY * Math.sin(theta)

    ret.push([longitude + x, latitude + y])
  }

  ret.push(ret[0])

  return {
    type: 'Polygon',
    coordinates: [ret],
  }
}
