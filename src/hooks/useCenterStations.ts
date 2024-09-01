import useMapStore from '@/stores/map'

export default function useCenterStations() {
  const { map } = useMapStore()

  const highlightBusStationPoint = (stationId: string) => {
    if (map === null) return

    const getPropertyValue = (targetProperty: string | number, defaultProperty: string | number) => [
      'case',
      ['==', ['get', 'id'], stationId],
      targetProperty,
      defaultProperty,
    ]

    map.setPaintProperty('center-bus-stations-layer', 'circle-color', getPropertyValue('#6d28d9', '#8b5cf6'))
    map.setPaintProperty('center-bus-stations-layer', 'circle-opacity', getPropertyValue(1, 0.5))
  }

  const dehighlightBusStationPoint = () => {
    if (map === null) return

    map.setPaintProperty('center-bus-stations-layer', 'circle-color', '#8b5cf6')
    map.setPaintProperty('center-bus-stations-layer', 'circle-opacity', 0.5)
  }

  return {
    highlightBusStationPoint,
    dehighlightBusStationPoint,
  }
}
