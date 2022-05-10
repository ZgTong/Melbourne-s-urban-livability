import { request } from "./request"
export const GetScene = (topic, year) => {
    return request.get('/scene',{ topic, year }).then((res) => res.data)
}