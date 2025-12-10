# Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Demo Login Credentials

- **Email:** admin@ltp.com
- **Password:** password123

## 📂 Key Files to Know

### Configuration
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `.env` - Environment variables
- `package.json` - Dependencies

### Entry Points
- `index.html` - HTML entry
- `src/main.jsx` - React entry
- `src/App.jsx` - Main app component
- `src/routes.jsx` - Route definitions

### API Layer
- `src/api/client.js` - Axios instance
- `src/api/endpoints.js` - API endpoints
- `src/api/hooks/` - React Query hooks

### Components
- `src/components/ui/` - Reusable UI components
- `src/components/layout/` - Layout components
- `src/components/forms/` - Form components
- `src/components/table/` - Table components

### Pages
- `src/pages/` - All page components

### Utilities
- `src/utils/constants.js` - App constants
- `src/utils/formatters.js` - Formatting functions
- `src/utils/validators.js` - Zod schemas

### Data
- `src/data/mockData.js` - Mock data for testing

## 🎨 Component Usage Examples

### Button
```jsx
import Button from './components/ui/Button'

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Variants: primary, secondary, success, danger, outline
// Sizes: sm, md, lg
```

### Input
```jsx
import Input from './components/ui/Input'

<Input
  label="Name"
  type="text"
  placeholder="Enter name"
  error={errors.name?.message}
  {...register('name')}
/>
```

### Select
```jsx
import Select from './components/ui/Select'

<Select
  label="Sport Type"
  value={sportType}
  onChange={setSportType}
  options={[
    { value: 'cricket', label: 'Cricket' },
    { value: 'football', label: 'Football' }
  ]}
/>
```

### Modal
```jsx
import Modal from './components/ui/Modal'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="lg"
>
  <p>Modal content here</p>
</Modal>

// Sizes: sm, md, lg, xl
```

### ConfirmDialog
```jsx
import ConfirmDialog from './components/ui/ConfirmDialog'

<ConfirmDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure?"
  variant="danger"
  confirmText="Delete"
  cancelText="Cancel"
/>
```

### DataTable
```jsx
import DataTable from './components/table/DataTable'

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <span>{row.status}</span>
  }
]

<DataTable
  columns={columns}
  data={data}
  loading={isLoading}
  pageSize={10}
/>
```

### StatsCard
```jsx
import StatsCard from './components/cards/StatsCard'
import { Calendar } from 'lucide-react'

<StatsCard
  title="Today's Bookings"
  value={24}
  icon={Calendar}
  color="primary"
/>

// Colors: primary, success, danger, accent
```

## 🔌 React Query Hook Usage

### useTurfs
```jsx
import { useTurfs } from './api/hooks/useTurfs'

const { data: turfs, isLoading, error } = useTurfs()
```

### useApproveTurf
```jsx
import { useApproveTurf } from './api/hooks/useTurfs'

const approveMutation = useApproveTurf()

approveMutation.mutate(turfId, {
  onSuccess: () => {
    // Handle success
  }
})
```

## 🎨 Tailwind CSS Classes

### Colors
```css
bg-primary          /* #2D6EF8 */
bg-primary-dark     /* #1749C6 */
bg-primary-light    /* #E8F0FF */
bg-success          /* #16A34A */
bg-danger           /* #DC2626 */
bg-accent           /* #F97316 */
```

### Common Patterns
```css
/* Card */
bg-white rounded-xl shadow-sm border border-gray-100 p-6

/* Button */
px-4 py-2 rounded-lg font-medium transition-colors

/* Input */
w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary
```

## 🛠 Utility Functions

### Format Currency
```jsx
import { formatCurrency } from './utils/formatters'

formatCurrency(1500) // ₹1,500
```

### Format Date
```jsx
import { formatDate, formatDateTime } from './utils/formatters'

formatDate('2024-03-15') // 15 Mar 2024
formatDateTime('2024-03-15T10:30:00Z') // 15 Mar 2024, 10:30 AM
```

### Format Phone
```jsx
import { formatPhone } from './utils/formatters'

formatPhone('9876543210') // +91 98765 43210
```

## 🔐 Authentication

### Check if Authenticated
```jsx
import { isAuthenticated } from './api/hooks/useAuth'

if (isAuthenticated()) {
  // User is logged in
}
```

### Get Current User
```jsx
import { getAuthUser } from './api/hooks/useAuth'

const user = getAuthUser()
console.log(user.name)
```

### Logout
```jsx
import { useLogout } from './api/hooks/useAuth'

const { mutate: logout } = useLogout()

logout()
```

## 📝 Form Validation

### Using React Hook Form + Zod
```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits')
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})

const onSubmit = (data) => {
  console.log(data)
}
```

## 🎯 Common Tasks

### Add New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/routes.jsx`
3. Add menu item in `src/components/layout/Sidebar.jsx`

### Add New API Hook
1. Create file in `src/api/hooks/useNewFeature.js`
2. Add endpoint in `src/api/endpoints.js`
3. Use in component with `useQuery` or `useMutation`

### Add New Component
1. Create file in appropriate folder
2. Export component
3. Import and use in pages

### Update Mock Data
1. Edit `src/data/mockData.js`
2. Add/modify data arrays
3. Components will automatically use new data

## 🐛 Debugging Tips

### Check Network Requests
- Open DevTools → Network tab
- Look for API calls
- Check request/response

### Check React Query Cache
- Install React Query DevTools
- View cached data
- See query states

### Check Console
- Look for errors
- Check validation messages
- View API responses

## 📦 Build & Deploy

### Build
```bash
npm run build
```
Output: `dist/` folder

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR',
    dark: '#YOUR_DARK_COLOR',
    light: '#YOUR_LIGHT_COLOR'
  }
}
```

### Change Port
Edit `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### Change API URL
Edit `.env`:
```
VITE_API_BASE_URL=https://your-api.com/api
```

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Framer Motion](https://www.framer.com/motion)
- [Headless UI](https://headlessui.com)

## 🎉 Quick Tips

1. **Use React Query DevTools** for debugging
2. **Check console** for validation errors
3. **Use mock data** for quick testing
4. **Follow existing patterns** when adding features
5. **Keep components small** and reusable
6. **Use TypeScript** for better type safety (optional)
7. **Add tests** before production
8. **Optimize images** before deploying
9. **Use environment variables** for configs
10. **Keep dependencies updated**

---

**Happy Coding! 🚀**
