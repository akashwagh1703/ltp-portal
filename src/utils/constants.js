export const BOOKING_STATUS = {
  SUCCESS: 'success',
  CANCELLED: 'cancelled',
  PENDING: 'pending'
}

export const TURF_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  SUSPENDED: 'suspended'
}

export const TURF_STATUS_LABEL = {
  draft: 'Draft',
  pending: 'Submitted',
  approved: 'Live',
  suspended: 'Suspended'
}

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid'
}

export const SPORT_TYPES = [
  'cricket',
  'football',
  'badminton',
  'tennis',
  'basketball',
  'volleyball'
]

export const PAYMENT_MODES = [
  'Online',
  'Cash',
  'UPI'
]

export const STATUS_COLORS = {
  success: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  draft: 'bg-gray-100 text-gray-700',
  approved: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
  paid: 'bg-green-100 text-green-800'
}
