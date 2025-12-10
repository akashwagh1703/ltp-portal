export const mockTurfs = [
  {
    turf_id: 1,
    name: 'Green Valley Sports Arena',
    address: 'Baner, Pune, Maharashtra 411045',
    lat: '18.5593',
    lng: '73.7789',
    price_per_hour: '1500',
    sport_type: 'Cricket',
    status: 'approved',
    owner_id: 1,
    owner_name: 'Rajesh Kumar',
    owner_phone: '9876543210',
    description: 'Premium cricket ground with professional turf and floodlights',
    size: '100x50 ft',
    capacity: '22',
    opening_time: '06:00 AM',
    closing_time: '11:00 PM',
    slot_duration: '60',
    images: ['turf1.jpg', 'turf1_2.jpg'],
    amenities: ['Parking', 'Washroom', 'Drinking Water', 'Changing Room', 'First Aid'],
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    turf_id: 2,
    name: 'Champions Football Ground',
    address: 'Hinjewadi, Pune, Maharashtra 411057',
    lat: '18.5912',
    lng: '73.7389',
    price_per_hour: '2000',
    sport_type: 'Football',
    status: 'pending',
    owner_id: 2,
    owner_name: 'Amit Sharma',
    owner_phone: '9876543211',
    description: 'Full-size football ground with artificial grass',
    size: '120x80 ft',
    capacity: '22',
    opening_time: '05:00 AM',
    closing_time: '10:00 PM',
    slot_duration: '90',
    images: ['turf2.jpg'],
    amenities: ['Parking', 'Washroom', 'Seating Area'],
    created_at: '2024-02-20T14:20:00Z'
  },
  {
    turf_id: 3,
    name: 'Elite Badminton Court',
    address: 'Koregaon Park, Pune, Maharashtra 411001',
    lat: '18.5362',
    lng: '73.8958',
    price_per_hour: '800',
    sport_type: 'Badminton',
    status: 'approved',
    owner_id: 3,
    owner_name: 'Priya Patel',
    owner_phone: '9876543212',
    description: 'Indoor badminton court with wooden flooring',
    size: '44x20 ft',
    capacity: '4',
    opening_time: '06:00 AM',
    closing_time: '10:00 PM',
    slot_duration: '60',
    images: ['turf3.jpg', 'turf3_2.jpg', 'turf3_3.jpg'],
    amenities: ['AC', 'Parking', 'Washroom', 'Drinking Water', 'Equipment Rental'],
    created_at: '2024-01-10T09:15:00Z'
  },
  {
    turf_id: 4,
    name: 'Victory Cricket Ground',
    address: 'Wakad, Pune, Maharashtra 411057',
    lat: '18.5974',
    lng: '73.7898',
    price_per_hour: '1800',
    sport_type: 'Cricket',
    status: 'approved',
    owner_id: 1,
    owner_name: 'Rajesh Kumar',
    owner_phone: '9876543210',
    description: 'Box cricket ground with nets and practice area',
    size: '80x40 ft',
    capacity: '16',
    opening_time: '06:00 AM',
    closing_time: '11:00 PM',
    slot_duration: '60',
    images: ['turf4.jpg'],
    amenities: ['Parking', 'Washroom', 'Drinking Water', 'Seating'],
    created_at: '2024-02-01T11:00:00Z'
  },
  {
    turf_id: 5,
    name: 'Star Badminton Arena',
    address: 'Viman Nagar, Pune, Maharashtra 411014',
    lat: '18.5679',
    lng: '73.9143',
    price_per_hour: '900',
    sport_type: 'Badminton',
    status: 'approved',
    owner_id: 3,
    owner_name: 'Priya Patel',
    owner_phone: '9876543212',
    description: 'Multi-court badminton facility with professional setup',
    size: '44x20 ft',
    capacity: '4',
    opening_time: '06:00 AM',
    closing_time: '11:00 PM',
    slot_duration: '60',
    images: ['turf5.jpg', 'turf5_2.jpg'],
    amenities: ['AC', 'Parking', 'Washroom', 'Cafeteria', 'Equipment Rental'],
    created_at: '2024-02-10T14:30:00Z'
  },
  {
    turf_id: 6,
    name: 'Premium Tennis Court',
    address: 'Kalyani Nagar, Pune, Maharashtra 411006',
    lat: '18.5485',
    lng: '73.9067',
    price_per_hour: '1200',
    sport_type: 'Tennis',
    status: 'approved',
    owner_id: 3,
    owner_name: 'Priya Patel',
    owner_phone: '9876543212',
    description: 'Professional tennis court with synthetic grass',
    size: '78x36 ft',
    capacity: '4',
    opening_time: '06:00 AM',
    closing_time: '09:00 PM',
    slot_duration: '60',
    images: ['turf6.jpg'],
    amenities: ['Parking', 'Washroom', 'Drinking Water', 'Coaching Available'],
    created_at: '2024-02-15T10:00:00Z'
  }
]

export const mockOwners = [
  {
    owner_id: 1,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9876543210',
    address: 'Baner, Pune, Maharashtra 411045',
    pan_number: 'ABCDE1234F',
    bank_name: 'HDFC Bank',
    account_number: '123456789012',
    ifsc_code: 'HDFC0001234',
    account_holder_name: 'Rajesh Kumar',
    total_turfs: 2,
    total_earnings: 125000,
    status: 'active',
    joined_date: '2023-12-01T00:00:00Z',
    turfs: ['Green Valley Sports Arena', 'Victory Cricket Ground']
  },
  {
    owner_id: 2,
    name: 'Amit Sharma',
    email: 'amit@example.com',
    phone: '9876543211',
    address: 'Hinjewadi, Pune, Maharashtra 411057',
    pan_number: 'FGHIJ5678K',
    bank_name: 'ICICI Bank',
    account_number: '987654321098',
    ifsc_code: 'ICIC0005678',
    account_holder_name: 'Amit Sharma',
    total_turfs: 1,
    total_earnings: 45000,
    status: 'active',
    joined_date: '2024-01-15T00:00:00Z',
    turfs: ['Champions Football Ground']
  },
  {
    owner_id: 3,
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '9876543212',
    address: 'Koregaon Park, Pune, Maharashtra 411001',
    pan_number: 'LMNOP9012Q',
    bank_name: 'SBI',
    account_number: '456789012345',
    ifsc_code: 'SBIN0009012',
    account_holder_name: 'Priya Patel',
    total_turfs: 3,
    total_earnings: 230000,
    status: 'active',
    joined_date: '2023-11-20T00:00:00Z',
    turfs: ['Elite Badminton Court', 'Star Badminton Arena', 'Premium Tennis Court']
  }
]

export const mockBookings = [
  {
    booking_id: 1,
    turf_name: 'Green Valley Sports Arena',
    player_name: 'Vikas Mehta',
    player_phone: '9123456789',
    booking_date: '2024-03-15',
    time_slot: '06:00 AM - 07:00 AM',
    amount: 1500,
    payment_mode: 'Online',
    status: 'success',
    created_at: '2024-03-10T10:30:00Z'
  },
  {
    booking_id: 2,
    turf_name: 'Champions Football Ground',
    player_name: 'Suresh Reddy',
    player_phone: '9123456790',
    booking_date: '2024-03-16',
    time_slot: '05:00 PM - 06:00 PM',
    amount: 2000,
    payment_mode: 'Cash',
    status: 'pending',
    created_at: '2024-03-11T14:20:00Z'
  },
  {
    booking_id: 3,
    turf_name: 'Elite Badminton Court',
    player_name: 'Neha Singh',
    player_phone: '9123456791',
    booking_date: '2024-03-14',
    time_slot: '07:00 AM - 08:00 AM',
    amount: 800,
    payment_mode: 'UPI',
    status: 'cancelled',
    created_at: '2024-03-09T09:15:00Z'
  }
]

export const mockPayouts = [
  {
    payout_id: 1,
    owner_id: 1,
    owner_name: 'Rajesh Kumar',
    total_amount: 50000,
    commission: 10,
    commission_amount: 5000,
    settlement_amount: 45000,
    status: 'paid',
    period: 'Feb 2024',
    paid_date: '2024-03-01T00:00:00Z'
  },
  {
    payout_id: 2,
    owner_id: 2,
    owner_name: 'Amit Sharma',
    total_amount: 30000,
    commission: 10,
    commission_amount: 3000,
    settlement_amount: 27000,
    status: 'pending',
    period: 'Feb 2024',
    paid_date: null
  },
  {
    payout_id: 3,
    owner_id: 3,
    owner_name: 'Priya Patel',
    total_amount: 80000,
    commission: 10,
    commission_amount: 8000,
    settlement_amount: 72000,
    status: 'paid',
    period: 'Feb 2024',
    paid_date: '2024-03-01T00:00:00Z'
  }
]

export const mockTurfUpdateRequests = [
  {
    request_id: 1,
    turf_id: 1,
    turf_name: 'Green Valley Sports Arena',
    owner_name: 'Rajesh Kumar',
    requested_at: '2024-03-10T10:30:00Z',
    status: 'pending',
    changes: {
      price_per_hour: { old: '1500', new: '1800' },
      address: { old: 'Baner, Pune, Maharashtra 411045', new: 'Baner Road, Pune, Maharashtra 411045' }
    }
  },
  {
    request_id: 2,
    turf_id: 3,
    turf_name: 'Elite Badminton Court',
    owner_name: 'Priya Patel',
    requested_at: '2024-03-12T14:20:00Z',
    status: 'pending',
    changes: {
      price_per_hour: { old: '800', new: '900' }
    }
  }
]

export const mockDashboardStats = {
  todayBookings: 24,
  todayEarnings: 45000,
  pendingPayouts: 125000,
  activeTurfs: 45,
  activeOwners: 28,
  totalRevenue: 2450000
}

export const mockRecentBookings = mockBookings.slice(0, 5)

export const mockTurfPerformance = [
  { name: 'Green Valley', bookings: 45, revenue: 67500 },
  { name: 'Champions Ground', bookings: 38, revenue: 76000 },
  { name: 'Elite Court', bookings: 52, revenue: 41600 },
  { name: 'Sports Arena', bookings: 30, revenue: 45000 },
  { name: 'Victory Ground', bookings: 28, revenue: 42000 }
]

export const mockOwnerLeaderboard = [
  { name: 'Rajesh Kumar', earnings: 125000, turfs: 2 },
  { name: 'Priya Patel', earnings: 230000, turfs: 3 },
  { name: 'Amit Sharma', earnings: 45000, turfs: 1 }
]
