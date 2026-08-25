import client from './client'
import { endpoints } from './endpoints'

// Authentication API calls
export const authAPI = {
  login: (credentials) => client.post(endpoints.auth.login, credentials),
  logout: () => client.post(endpoints.auth.logout),
  me: () => client.get(endpoints.auth.me)
}

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => client.get(endpoints.dashboard.stats),
  getRecentBookings: () => client.get(endpoints.dashboard.recentBookings)
}

// Turfs API calls
export const turfsAPI = {
  list: (params) => client.get(endpoints.turfs.list, { params }),
  detail: (id) => client.get(endpoints.turfs.detail(id)),
  create: (data) => client.post(endpoints.turfs.list, data),
  update: (id, data) => client.put(endpoints.turfs.detail(id), data),
  delete: (id) => client.delete(endpoints.turfs.detail(id)),
  approve: (id) => client.post(endpoints.turfs.approve(id)),
  reject: (id) => client.post(endpoints.turfs.reject(id)),
  suspend: (id) => client.post(endpoints.turfs.suspend(id)),
  activate: (id) => client.post(endpoints.turfs.activate(id)),
  uploadImages: (id, formData) => client.post(endpoints.turfs.uploadImages(id), formData)
}

// Turf Images API calls
export const turfImagesAPI = {
  delete: (id) => client.delete(endpoints.turfImages.delete(id)),
  setPrimary: (id) => client.post(endpoints.turfImages.setPrimary(id))
}

// Owners API calls
export const ownersAPI = {
  list: (params) => client.get(endpoints.owners.list, { params }),
  detail: (id) => client.get(endpoints.owners.detail(id)),
  create: (data) => client.post(endpoints.owners.list, data),
  update: (id, data) => client.put(endpoints.owners.detail(id), data),
  delete: (id) => client.delete(endpoints.owners.detail(id)),
  updateStatus: (id, status) => client.put(endpoints.owners.updateStatus(id), { status })
}

// Players API calls
export const playersAPI = {
  list: (params) => client.get(endpoints.players.list, { params }),
  detail: (id) => client.get(endpoints.players.detail(id)),
  updateStatus: (id, status) => client.put(endpoints.players.updateStatus(id), { status })
}

// Bookings API calls
export const bookingsAPI = {
  list: (params) => client.get(endpoints.bookings.list, { params }),
  detail: (id) => client.get(endpoints.bookings.detail(id)),
  cancel: (id, reason) => client.post(endpoints.bookings.cancel(id), { reason })
}

// Payouts API calls
export const payoutsAPI = {
  list: (params) => client.get(endpoints.payouts.list, { params }),
  generate: (data) => client.post(endpoints.payouts.generate, data),
  process: (id) => client.post(endpoints.payouts.process(id)),
  release: (id) => client.post(endpoints.payouts.release(id))
}

// Coupons API calls
export const couponsAPI = {
  list: (params) => client.get(endpoints.coupons.list, { params }),
  detail: (id) => client.get(endpoints.coupons.detail(id)),
  create: (data) => client.post(endpoints.coupons.create, data),
  update: (id, data) => client.put(endpoints.coupons.update(id), data),
  delete: (id) => client.delete(endpoints.coupons.delete(id))
}

// Reviews API calls
export const reviewsAPI = {
  list: (params) => client.get(endpoints.reviews.list, { params }),
  updateStatus: (id, status) => client.put(endpoints.reviews.updateStatus(id), { status }),
  delete: (id) => client.delete(endpoints.reviews.delete(id))
}

// Turf Update Requests API calls
export const turfUpdateRequestsAPI = {
  list: (params) => client.get(endpoints.turfUpdateRequests.list, { params }),
  approve: (id) => client.post(endpoints.turfUpdateRequests.approve(id)),
  reject: (id, reason) => client.post(endpoints.turfUpdateRequests.reject(id), { reason })
}

// Reports API calls
export const reportsAPI = {
  bookings: (params) => client.get(endpoints.reports.bookings, { params }),
  turfWise: (params) => client.get(endpoints.reports.turfWise, { params }),
  ownerWise: (params) => client.get(endpoints.reports.ownerWise, { params }),
  paymentMode: (params) => client.get(endpoints.reports.paymentMode, { params })
}

// CMS API calls
export const cmsAPI = {
  banners: {
    list: (params) => client.get(endpoints.cms.banners, { params }),
    create: (data) => client.post(endpoints.cms.banners, data),
    update: (id, data) => client.put(`${endpoints.cms.banners}/${id}`, data),
    delete: (id) => client.delete(`${endpoints.cms.banners}/${id}`)
  },
  faqs: {
    list: (params) => client.get(endpoints.cms.faqs, { params }),
    create: (data) => client.post(endpoints.cms.faqs, data),
    update: (id, data) => client.put(`${endpoints.cms.faqs}/${id}`, data),
    delete: (id) => client.delete(`${endpoints.cms.faqs}/${id}`)
  }
}

// Settings API calls
export const settingsAPI = {
  list: () => client.get(endpoints.settings.list),
  update: (data) => client.post(endpoints.settings.update, data),
  updateSingle: (key, value) => client.put(endpoints.settings.updateSingle(key), { value })
}

// Subscriptions API calls
export const subscriptionsAPI = {
  list: (params) => client.get(endpoints.subscriptions.list, { params }),
  create: (data) => client.post(endpoints.subscriptions.create, data),
  renew: (id, data) => client.post(endpoints.subscriptions.renew(id), data),
  plans: () => client.get(endpoints.subscriptions.plans),
  updatePlan: (id, data) => client.put(endpoints.subscriptions.updatePlan(id), data),
  ownersWithout: () => client.get(endpoints.subscriptions.ownersWithout),
  statistics: () => client.get(endpoints.subscriptions.statistics)
}

// Logs API calls
export const logsAPI = {
  activity: (params) => client.get(endpoints.logs.activity, { params })
}

// Export all APIs
export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  turfs: turfsAPI,
  turfImages: turfImagesAPI,
  owners: ownersAPI,
  players: playersAPI,
  bookings: bookingsAPI,
  payouts: payoutsAPI,
  coupons: couponsAPI,
  reviews: reviewsAPI,
  turfUpdateRequests: turfUpdateRequestsAPI,
  reports: reportsAPI,
  cms: cmsAPI,
  settings: settingsAPI,
  subscriptions: subscriptionsAPI,
  logs: logsAPI
}