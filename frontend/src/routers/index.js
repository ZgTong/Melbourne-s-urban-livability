import { lazy } from 'react'

const Home = lazy(() => import('../containers/Home'))
const NotFound = lazy(() => import('../containers/NotFound'))

const Routers = [
    {
        path: '/home',
        component: Home,
        root: [],
        exact: true
    },
    {
        path: '*',
        component: NotFound,
        root: [],
        exact: false
    },
]

export default Routers