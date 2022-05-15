import { request } from "./request"
export const GetScene = (topic, year) => {
    return request.get('/scene',{ topic, year }).then((res) => res.data)
}
export const GetWeather = () => {
    return request.get('/weather').then((res) => res.data)
}
export const GetSports = () => {
    return request.get('/sports').then((res) => res.data)
}
export const GetSuburbs = () => {
    return request.get(`${process.env.REACT_APP_WEB_SERVER}/city_suburb_map.json`)
}
export const GetBarCafe = () => {
    return request.get('/foods')
}
export const GetLineData = (topic) => {
    return request.get('/LineData',{ topic }).then((res) => res.data)
}