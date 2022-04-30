import { request } from "./request"
export const GetSports = () => {
    return request.get('/sports').then((res) => res.data)
}