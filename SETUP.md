# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env` file is already created with default values:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Update this URL to point to your backend API when ready.

### 3. Start Development Server
```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 4. Login
Use these demo credentials:
- **Email:** admin@ltp.com
- **Password:** password123

## Project Features

### ✅ Completed Modules
1. **Authentication** - Login with token-based auth
2. **Dashboard** - Stats, charts, recent bookings
3. **Turf Management** - Approve, reject, suspend turfs
4. **Owner Management** - Manage owners, suspend/activate
5. **Booking Management** - View and cancel bookings
6. **Payout Management** - Release payouts, view settlements
7. **Turf Update Requests** - Review and approve changes with diff viewer
8. **Reports** - Placeholder for analytics
9. **CMS** - Placeholder for content management
10. **Settings** - Placeholder for configuration
11. **Logs** - Placeholder for audit logs

### 🎨 UI Components
- Button (5 variants)
- Input (with validation)
- Select (Headless UI dropdown)
- Modal (animated)
- ConfirmDialog
- DataTable (sortable, paginated)
- StatsCard
- Toast notifications
- Forms (Turf, Owner)
- Charts (Bar, Line)

### 🔧 Technical Features
- ✅ React 18 with Hooks
- ✅ Vite for fast builds
- ✅ Tailwind CSS styling
- ✅ React Router DOM routing
- ✅ React Query for data fetching
- ✅ Axios with interceptors
- ✅ React Hook Form + Zod validation
- ✅ Framer Motion animations
- ✅ Headless UI components
- ✅ Lucide icons
- ✅ DayJS date formatting
- ✅ React Hot Toast notifications

### 📝 Validation Rules
- ✅ No `type="number"` inputs (using text + regex)
- ✅ Phone: 10 digits only
- ✅ Price: digits only, > 0
- ✅ Lat/Lng: decimal numbers
- ✅ Commission: 0-100
- ✅ Turf name: min 3 chars
- ✅ Address: min 6 chars

## Connecting to Real API

Currently using mock data. To connect to real API:

1. Update `.env` with your API URL
2. Open hook files in `src/api/hooks/`
3. Uncomment API calls and remove mock data imports

Example in `useTurfs.js`:
```javascript
// Remove this:
import { mockTurfs } from '../../data/mockData'
return mockTurfs

// Uncomment this:
const { data } = await client.get(endpoints.turfs.list, { params: filters })
return data
```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready to deploy.

## Folder Structure

```
src/
├── api/                    # API client and hooks
├── components/             # Reusable components
│   ├── layout/            # Layout components
│   ├── ui/                # UI primitives
│   ├── table/             # Table components
│   ├── cards/             # Card components
│   ├── forms/             # Form components
│   └── charts/            # Chart components
├── pages/                 # Page components
├── utils/                 # Utilities
├── data/                  # Mock data
└── styles/                # Global styles
```

## Performance Optimizations

- React Query caching (5 min stale time)
- Code splitting by route
- Optimized re-renders
- Smooth animations (100-200ms)
- Lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port already in use
Change port in `vite.config.js`:
```javascript
server: {
  port: 3001  // Change to any available port
}
```

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Start dev server
3. ✅ Test all modules
4. 🔄 Connect to real API
5. 🔄 Deploy to production

## Support

For issues or questions, contact the development team.
