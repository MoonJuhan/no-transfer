export interface Station {
  id: string
  name: string
  gpsX: string
  gpsY: string
}

export interface Route {
  id: string
  name: string
  stations?: Station[]
}

export interface ApiGetRouteByStationResponse {
  busRouteId: string
  busRouteNm: string
  busRouteAbrv: string
  length: string
  busRouteType: string
  stBegin: string
  stEnd: string
  term: string
  nextBus: string
  firstBusTm: string
  lastBusTm: string
  firstBusTmLow: string
  lastBusTmLow: string
}

export interface ApiGetStaionByRouteResponse {
  arsId: string
  stationNm: string
  gpsX: string
  gpsY: string
  busRouteId: string
  busRouteNm: string
  busRouteAbrv: string
  seq: string
  section: string
  station: string
  posX: string
  posY: string
  fullSectDist: string
  direction: string
  stationNo: string
  routeType: string
  beginTm: string
  lastTm: string
  trnstnid: string
  sectSpd: string
  transYn: string
}

export interface ApiGetStationByPosResponse {
  arsId: string
  dist: string
  gpsX: string
  gpsY: string
  posX: string
  posY: string
  stationId: string
  stationNm: string
  stationTp: string
}
