import { dashboardHandlers } from './dashboardHandlers'
import { ordersHandlers } from './ordersHandlers'

export const handlers = [...ordersHandlers, ...dashboardHandlers]
