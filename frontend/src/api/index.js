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
    return request.get('http://localhost:3000/city_suburb_map.json')
}