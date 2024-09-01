import { useRef, useState } from 'react'
import useMapStore from '@/stores/map'
import { Station } from '@/types'

export default function useCenterStations() {
  const { map } = useMapStore()

  const SOURCE_ID = 'center-bus-stations-source'
  const LAYER_ID = 'center-bus-stations-layer'
  const DEFAULT_CIRCLE_COLOR = '#8b5cf6'
  const DEFAULT_CIRCLE_OPACITY = 0.5
  const HIGHLIGHTED_CIRCLE_COLOR = '#6d28d9'
  const HIGHLIGHTED_CIRCLE_OPACITY = 1

  const [highlightedPointIds, setHighlightedPointIds] = useState<string[]>([])
  const prevHighlightedPointIdsRef = useRef<string[]>([])

  const updateHighlightedPoints = () => {
    const prevHighlightedPointId = prevHighlightedPointIdsRef.current

    if (
      highlightedPointIds.length !== prevHighlightedPointId.length ||
      highlightedPointIds.some((id, index) => id !== prevHighlightedPointId[index])
    ) {
      dehighlightBusStationPoint()
      highlightedPointIds.forEach(highlightBusStationPoint)

      prevHighlightedPointIdsRef.current = highlightedPointIds
    }
  }

  const drawBusStationPoints = (busStations: Station[]) => {
    if (map === null) return

    const features: GeoJSON.Feature<GeoJSON.Point>[] = busStations.map((station) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [Number(station.gpsX), Number(station.gpsY)],
      },
      properties: {
        id: `center-bus-station-${station.id}`,
      },
    }))

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    })

    map.addLayer({
      id: LAYER_ID,
      type: 'circle',
      source: SOURCE_ID,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 4, 15, 10],
        'circle-color': DEFAULT_CIRCLE_COLOR,
        'circle-opacity': DEFAULT_CIRCLE_OPACITY,
      },
    })
  }

  const addBusStationPointsEventListeners = () => {
    if (map === null) return

    map.on('mousemove', LAYER_ID, (event) => {
      map.getCanvas().style.cursor = 'pointer'

      const features = map.queryRenderedFeatures(event.point, {
        layers: [LAYER_ID],
      })

      const pointIds = features.map((feature) => feature.properties?.id || '').filter((id) => id !== '')
      setHighlightedPointIds(pointIds)
    })

    map.on('mouseleave', LAYER_ID, () => {
      map.getCanvas().style.cursor = ''

      setHighlightedPointIds([])
    })
  }

  const highlightBusStationPoint = (pointId: string) => {
    if (map === null) return

    const getPropertyValue = (targetProperty: string | number, defaultProperty: string | number) => [
      'case',
      ['==', ['get', 'id'], pointId],
      targetProperty,
      defaultProperty,
    ]

    map.setPaintProperty(LAYER_ID, 'circle-color', getPropertyValue(HIGHLIGHTED_CIRCLE_COLOR, DEFAULT_CIRCLE_COLOR))
    map.setPaintProperty(
      LAYER_ID,
      'circle-opacity',
      getPropertyValue(HIGHLIGHTED_CIRCLE_OPACITY, DEFAULT_CIRCLE_OPACITY),
    )
  }

  const dehighlightBusStationPoint = () => {
    if (map === null) return

    map.setPaintProperty(LAYER_ID, 'circle-color', DEFAULT_CIRCLE_COLOR)
    map.setPaintProperty(LAYER_ID, 'circle-opacity', DEFAULT_CIRCLE_OPACITY)
  }

  return {
    drawBusStationPoints,
    addBusStationPointsEventListeners,
    highlightedPointIds,
    updateHighlightedPoints,
    highlightBusStationPoint,
    dehighlightBusStationPoint,
  }
}
