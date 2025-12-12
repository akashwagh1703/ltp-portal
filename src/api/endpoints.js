export const endpoints = {
  auth: {
    login: '/v1/admin/login',
    logout: '/v1/admin/logout',
    me: '/v1/admin/me'
  },
  turfs: {
    list: '/v1/admin/turfs',
    detail: (id) => `/v1/admin/turfs/${id}`,
    approve: (id) => `/v1/admin/turfs/${id}/approve`,
    reject: (id) => `/v1/admin/turfs/${id}/reject`,
    suspend: (id) => `/v1/admin/turfs/${id}/suspend`,
    activate: (id) => `/v1/admin/turfs/${id}/activate`
  },
  owners: {
    list: '/v1/admin/owners',
    detail: (id) => `/v1/admin/owners/${id}`,
    updateStatus: (id) => `/v1/admin/owners/${id}/status`
  },
  players: {
    list: '/v1/admin/players',
    detail: (id) => `/v1/admin/players/${id}`,
    updateStatus: (id) => `/v1/admin/players/${id}/status`
  },
  bookings: {
    list: '/v1/admin/bookings',
    detail: (id) => `/v1/admin/bookings/${id}`,
    cancel: (id) => `/v1/admin/bookings/${id}/cancel`
  },
  payouts: {
    list: '/v1/admin/payouts',
    detail: (id) => `/v1/admin/payouts/${id}`,
    generate: '/v1/admin/payouts/generate',
    process: (id) => `/v1/admin/payouts/${id}/process`,
    release: (id) => `/v1/admin/payouts/${id}/release`
  },
  coupons: {
    list: '/v1/admin/coupons',
    detail: (id) => `/v1/admin/coupons/${id}`,
    create: '/v1/admin/coupons',
    update: (id) => `/v1/admin/coupons/${id}`,
    delete: (id) => `/v1/admin/coupons/${id}`
  },
  reviews: {
    list: '/v1/admin/reviews',
    updateStatus: (id) => `/v1/admin/reviews/${id}/status`,
    delete: (id) => `/v1/admin/reviews/${id}`
  },
  turfUpdateRequests: {
    list: '/v1/admin/turf-update-requests',
    approve: (id) => `/v1/admin/turf-update-requests/${id}/approve`,
    reject: (id) => `/v1/admin/turf-update-requests/${id}/reject`
  },
  reports: {
    bookings: '/v1/admin/reports/bookings',
    turfWise: '/v1/admin/reports/turf-wise',
    ownerWise: '/v1/admin/reports/owner-wise',
    paymentMode: '/v1/admin/reports/payment-mode'
  },
  cms: {
    banners: '/v1/admin/banners',
    faqs: '/v1/admin/faqs'
  },
  dashboard: {
    stats: '/v1/admin/dashboard/stats',
    recentBookings: '/v1/admin/dashboard/recent-bookings'
  },
  settings: {
    list: '/v1/admin/settings',
    update: '/v1/admin/settings',
    updateSingle: (key) => `/v1/admin/settings/${key}`
  },
  subscriptions: {
    list: '/v1/admin/subscriptions',
    create: '/v1/admin/subscriptions',
    renew: (id) => `/v1/admin/subscriptions/${id}/renew`,
    plans: '/v1/admin/subscriptions/plans',
    updatePlan: (id) => `/v1/admin/subscriptions/plans/${id}`,
    ownersWithout: '/v1/admin/subscriptions/owners-without',
    statistics: '/v1/admin/subscriptions/statistics'
  },
  logs: {
    activity: '/v1/admin/logs/activity'
  }
}
