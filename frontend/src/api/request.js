import axios from "axios"
import { API_SERVER } from "../settings"

export const baseURL = API_SERVER

const timeout = 100000
const serviceInstance = axios.create({
    timeout,
    baseURL,
    withCredentials: true,
})

serviceInstance.interceptors.request.use(
    (config) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        config.headers = headers
        return config
    },
    (error) => {
        console.log(error)
        Promise.reject(error)
    }
)

serviceInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const { response } = error
        if (response) {
            return Promise.reject(response.data)
        }
        return Promise.reject(response.data)
    }
)

const requestHandler = (
    method,
    url,
    params,
    config
) => {
    let response
    switch (method) {
        case 'get':
            response = serviceInstance.get(url, {
                params: { ...params },
                ...config,
            })
            break
        case 'post':
            response = serviceInstance.post(url, { ...params }, { ...config })
            break
        case 'put':
            response = serviceInstance.put(url, { ...params }, { ...config })
            break
        case 'delete':
            response = serviceInstance.delete(url, {
                params: { ...params },
                ...config,
            })
            break
        default:
            response = serviceInstance.get(url, {
                params: { ...params },
                ...config,
            })
            break
    }

    return new Promise((resolve, reject) => {
        response
            .then((res) => {
                const { data } = res
                console.log('haha', data)
                // if (data.code !== 200) {
                //     if (data.code === 401) {
                //         message.warn(
                //             'Your account has been logged out or timed out and will be logged out soon...'
                //         )
                //         console.log('Abnormal login...')
                //     }
                //
                //     const e = JSON.stringify(data)
                //     message.warn(`Request Error：${e}`)
                //     console.log(`Request Error：${e}`)
                //     reject(data)
                // } else {
                //     resolve(data.data)
                // }
            })
            .catch((error) => {
                const e = JSON.stringify(error)
                console.log('error', e)
                reject(error)
            })
    })
}

const request = {
    get: (url, params, config) =>
requestHandler('get', url, params, config),
    post: (url, params, config) =>
requestHandler('post', url, params, config),
    put: (url, params, config) =>
requestHandler('put', url, params, config),
    delete: (url, params, config) =>
requestHandler('delete', url, params, config),
}

export { request }