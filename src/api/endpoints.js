export const endpoints = {
  auth: {
    login: '/admin/login',
    logout: '/admin/logout',
    me: '/admin/me'
  },
  turfs: {
    list: '/admin/turfs',
    detail: (id) => `/admin/turfs/${id}`,
    approve: (id) => `/admin/turfs/${id}/approve`,
    reject: (id) => `/admin/turfs/${id}/reject`,
    suspend: (id) => `/admin/turfs/${id}/suspend`,
    activate: (id) => `/admin/turfs/${id}/activate`,
    uploadImages: (id) => `/admin/turfs/${id}/images`
  },
  turfImages: {
    delete: (id) => `/admin/turf-images/${id}`,
    setPrimary: (id) => `/admin/turf-images/${id}/set-primary`
  },
  owners: {
    list: '/admin/owners',
    detail: (id) => `/admin/owners/${id}`,
    updateStatus: (id) => `/admin/owners/${id}/status`
  },
  players: {
    list: '/admin/players',
    detail: (id) => `/admin/players/${id}`,
    updateStatus: (id) => `/admin/players/${id}/status`
  },
  bookings: {
    list: '/admin/bookings',
    detail: (id) => `/admin/bookings/${id}`,
    cancel: (id) => `/admin/bookings/${id}/cancel`
  },
  payouts: {
    list: '/admin/payouts',
    generate: '/admin/payouts/generate',
    process: (id) => `/admin/payouts/${id}/process`,
    release: (id) => `/admin/payouts/${id}/release`
  },
  coupons: {
    list: '/admin/coupons',
    detail: (id) => `/admin/coupons/${id}`,
    create: '/admin/coupons',
    update: (id) => `/admin/coupons/${id}`,
    delete: (id) => `/admin/coupons/${id}`
  },
  reviews: {
    list: '/admin/reviews',
    updateStatus: (id) => `/admin/reviews/${id}/status`,
    delete: (id) => `/admin/reviews/${id}`
  },
  turfUpdateRequests: {
    list: '/admin/turf-update-requests',
    approve: (id) => `/admin/turf-update-requests/${id}/approve`,
    reject: (id) => `/admin/turf-update-requests/${id}/reject`
  },
  reports: {
    bookings: '/admin/reports/bookings',
    turfWise: '/admin/reports/turf-wise',
    ownerWise: '/admin/reports/owner-wise',
    paymentMode: '/admin/reports/payment-mode'
  },
  cms: {
    banners: '/admin/banners',
    faqs: '/admin/faqs'
  },
  dashboard: {
    stats: '/admin/dashboard/stats',
    recentBookings: '/admin/dashboard/recent-bookings'
  },
  settings: {
    list: '/admin/settings',
    update: '/admin/settings',
    updateSingle: (key) => `/admin/settings/${key}`
  },
  subscriptions: {
    list: '/admin/subscriptions',
    create: '/admin/subscriptions',
    renew: (id) => `/admin/subscriptions/${id}/renew`,
    plans: '/admin/subscriptions/plans',
    updatePlan: (id) => `/admin/subscriptions/plans/${id}`,
    ownersWithout: '/admin/subscriptions/owners-without',
    statistics: '/admin/subscriptions/statistics',
    feePayments: '/admin/subscription-payments',
    confirmFee: (id) => `/admin/subscription-payments/${id}/confirm`,
    rejectFee: (id) => `/admin/subscription-payments/${id}/reject`
  },
  platformUpi: {
    get: '/admin/settings/platform-upi',
    update: '/admin/settings/platform-upi'
  },
  logs: {
    activity: '/admin/logs/activity'
  }
}
