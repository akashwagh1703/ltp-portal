export const endpoints = {
  auth: {
    login: '/admin/login',
    logout: '/admin/logout',
    profile: '/admin/profile'
  },
  turfs: {
    list: '/admin/turfs',
    detail: (id) => `/admin/turfs/${id}`,
    approve: (id) => `/admin/turfs/${id}/approve`,
    reject: (id) => `/admin/turfs/${id}/reject`,
    suspend: (id) => `/admin/turfs/${id}/suspend`,
    activate: (id) => `/admin/turfs/${id}/activate`
  },
  owners: {
    list: '/admin/owners',
    detail: (id) => `/admin/owners/${id}`,
    suspend: (id) => `/admin/owners/${id}/suspend`,
    activate: (id) => `/admin/owners/${id}/activate`
  },
  bookings: {
    list: '/admin/bookings',
    detail: (id) => `/admin/bookings/${id}`,
    cancel: (id) => `/admin/bookings/${id}/cancel`
  },
  payouts: {
    list: '/admin/payouts',
    detail: (id) => `/admin/payouts/${id}`,
    release: (id) => `/admin/payouts/${id}/release`
  },
  turfUpdateRequests: {
    list: '/admin/turf-update-requests',
    detail: (id) => `/admin/turf-update-requests/${id}`,
    approve: (id) => `/admin/turf-update-requests/${id}/approve`,
    reject: (id) => `/admin/turf-update-requests/${id}/reject`
  },
  reports: {
    dashboard: '/admin/reports/dashboard',
    bookings: '/admin/reports/bookings',
    revenue: '/admin/reports/revenue',
    turfWise: '/admin/reports/turf-wise',
    ownerWise: '/admin/reports/owner-wise'
  },
  cms: {
    banners: '/admin/cms/banners',
    faqs: '/admin/cms/faqs',
    terms: '/admin/cms/terms'
  },
  logs: {
    list: '/admin/logs',
    activity: '/admin/logs/activity'
  }
}
