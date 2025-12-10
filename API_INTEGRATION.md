# API Integration Guide - Admin Frontend

## ✅ Completed Integration

### Services Created (10 files)
1. **api.js** - Axios instance with interceptors
2. **authService.js** - Login, logout, getMe
3. **dashboardService.js** - Stats and recent bookings
4. **ownerService.js** - Owner CRUD operations
5. **turfService.js** - Turf CRUD operations
6. **bookingService.js** - Booking management
7. **playerService.js** - Player management
8. **payoutService.js** - Payout operations
9. **reportService.js** - Reports and analytics
10. **settingService.js** - Settings management

### Pages Updated (3 files)
1. **Login.jsx** - Real API authentication
2. **Dashboard.jsx** - Real stats and bookings
3. **Owners.jsx** - Real owner data and operations

---

## 🔧 Configuration

### API Base URL
```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api/v1'
```

### Authentication
- Token stored in `localStorage` as `token`
- Auto-attached to all requests via interceptor
- Auto-redirect to login on 401 errors

---

## 📝 Remaining Pages to Update

### High Priority
- [ ] **Turfs.jsx** - Use turfService
- [ ] **Bookings.jsx** - Use bookingService
- [ ] **Payouts.jsx** - Use payoutService
- [ ] **Reports.jsx** - Use reportService
- [ ] **Settings.jsx** - Use settingService

### Medium Priority
- [ ] **Players.jsx** - Use playerService
- [ ] **Banners.jsx** - Create bannerService
- [ ] **FAQs.jsx** - Create faqService
- [ ] **Coupons.jsx** - Create couponService

### Low Priority
- [ ] **Logs.jsx** - Create logService
- [ ] **Profile.jsx** - Use authService

---

## 🚀 Quick Integration Steps

### 1. Create Service (if needed)
```javascript
// src/services/exampleService.js
import api from './api';

export const exampleService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/endpoint', { params });
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/admin/endpoint', data);
    return response.data;
  },
};
```

### 2. Update Component
```javascript
import { useState, useEffect } from 'react';
import { exampleService } from '../services/exampleService';
import toast from 'react-hot-toast';

export default function Example() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await exampleService.getAll();
      setData(result.data || result);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return <div>{/* Your JSX */}</div>;
}
```

---

## 🔑 API Endpoints Reference

### Admin Auth
- POST `/admin/login` - Login
- POST `/admin/logout` - Logout
- GET `/admin/me` - Get current user

### Dashboard
- GET `/admin/dashboard/stats` - Dashboard statistics
- GET `/admin/dashboard/recent-bookings` - Recent bookings

### Owners
- GET `/admin/owners` - List owners
- POST `/admin/owners` - Create owner
- GET `/admin/owners/{id}` - Get owner
- PUT `/admin/owners/{id}` - Update owner
- DELETE `/admin/owners/{id}` - Delete owner

### Turfs
- GET `/admin/turfs` - List turfs
- POST `/admin/turfs` - Create turf
- GET `/admin/turfs/{id}` - Get turf
- PUT `/admin/turfs/{id}` - Update turf
- DELETE `/admin/turfs/{id}` - Delete turf

### Bookings
- GET `/admin/bookings` - List bookings
- GET `/admin/bookings/{id}` - Get booking
- POST `/admin/bookings/{id}/cancel` - Cancel booking

### Payouts
- GET `/admin/payouts` - List payouts
- POST `/admin/payouts/generate` - Generate payout
- POST `/admin/payouts/{id}/process` - Process payout

### Reports
- GET `/admin/reports/bookings` - Bookings report
- GET `/admin/reports/turf-wise` - Turf-wise report
- GET `/admin/reports/owner-wise` - Owner-wise report
- GET `/admin/reports/payment-mode` - Payment mode report

---

## 🎯 Testing

### 1. Start Backend
```bash
cd ltp-apis
php artisan serve
```

### 2. Start Frontend
```bash
cd ltp-admin-frontend
npm run dev
```

### 3. Test Login
- URL: http://localhost:3011/login
- Email: admin@letsturf.com
- Password: admin123

---

## ✅ Integration Checklist

- [x] API service layer created
- [x] Axios interceptors configured
- [x] Authentication flow working
- [x] Dashboard integrated
- [x] Owners page integrated
- [ ] All pages integrated
- [ ] Error handling standardized
- [ ] Loading states implemented
- [ ] Success/error toasts added

---

## 📊 Progress

**Completed**: 30%
- Services: 10/10 ✅
- Pages: 3/11 (27%)

**Next Steps**:
1. Update Turfs page
2. Update Bookings page
3. Update Payouts page
4. Update Reports page
5. Update Settings page
