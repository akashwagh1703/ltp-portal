# Let's Turf Play - Admin Portal

A production-grade, scalable admin web application for the turf booking platform.

## 🚀 Features

- **Dashboard** - Real-time stats, bookings, and performance metrics
- **Turf Management** - Approve, reject, suspend, and manage turfs
- **Owner Management** - Manage turf owners and their accounts
- **Booking Management** - View and manage all bookings
- **Payout Management** - Handle owner settlements and commissions
- **Turf Update Requests** - Review and approve turf update requests with diff viewer
- **Reports & Analytics** - Comprehensive reporting system
- **CMS** - Manage banners, FAQs, and content
- **Logs & Audit** - System logs and activity tracking
- **Settings** - Platform configuration

## 🛠 Tech Stack

- **React 18** with Hooks
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Framer Motion** - Smooth animations
- **Headless UI** - Accessible components
- **Lucide React** - Beautiful icons
- **DayJS** - Date formatting
- **React Hot Toast** - Notifications

## 📦 Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

### Colors
- Primary: `#2D6EF8`
- Primary Dark: `#1749C6`
- Primary Light: `#E8F0FF`
- Success: `#16A34A`
- Danger: `#DC2626`
- Accent: `#F97316`

### Typography
- Font Family: Inter
- Headings: 32px / 28px / 24px
- Body: 16px
- Small: 14px / 12px

## 📁 Project Structure

```
src/
├── api/
│   ├── client.js              # Axios client with interceptors
│   ├── endpoints.js           # API endpoint definitions
│   └── hooks/                 # React Query hooks
├── components/
│   ├── layout/                # Layout components
│   ├── ui/                    # Reusable UI components
│   ├── table/                 # Table components
│   ├── cards/                 # Card components
│   └── forms/                 # Form components
├── pages/                     # Page components
├── utils/                     # Utility functions
├── data/                      # Mock data
└── styles/                    # Global styles
```

## 🔐 Authentication

The app uses token-based authentication. Tokens are stored in localStorage.

**Demo Credentials:**
- Email: admin@ltp.com
- Password: password123

## 🎯 Key Features

### No `type="number"` Inputs
All numeric inputs use `type="text"` with regex validation for better UX.

### Validation
- Zod schemas for all forms
- Real-time validation feedback
- Custom error messages

### Performance
- React Query caching
- Code splitting
- Optimized re-renders
- Smooth animations (100-200ms)

### Accessibility
- ARIA labels
- Keyboard navigation
- Focus management
- High contrast

## 🔄 API Integration

To connect to real API:

1. Update `.env` with your API URL
2. Replace mock data imports in hooks with actual API calls
3. Uncomment API calls in hooks files

Example:
```javascript
// Before (Mock)
return mockTurfs

// After (Real API)
const { data } = await client.get(endpoints.turfs.list, { params: filters })
return data
```

## 📱 Responsive Design

- Desktop-first approach
- Fully responsive on all devices
- Mobile-optimized navigation

## 🎨 Component Library

All components are reusable and follow consistent patterns:
- Button (5 variants)
- Input (with validation)
- Select (Headless UI)
- Modal (animated)
- ConfirmDialog
- DataTable (sortable, paginated)
- StatsCard
- Toast notifications

## 🚀 Deployment

```bash
# Build for production
npm run build

# The dist/ folder is ready to deploy
```

Deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

## 📝 License

Proprietary - Let's Turf Play

## 👥 Support

For support, contact the development team.
