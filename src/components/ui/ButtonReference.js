// Button Design System Reference
// Use this as a guide for consistent button usage across the admin portal

import Button from '../components/ui/Button'

// VARIANTS
// primary - Main actions (blue)
// secondary - Secondary actions (gray)  
// success - Positive actions (green)
// danger - Destructive actions (red)
// warning - Caution actions (yellow)
// outline - Subtle actions (white with border)
// ghost - Minimal actions (transparent)

// SIZES
// xs - Extra small (px-2 py-1 text-xs)
// sm - Small (px-3 py-1.5 text-sm) 
// md - Medium (px-4 py-2 text-sm) - DEFAULT
// lg - Large (px-6 py-3 text-base)

// USAGE EXAMPLES

// Primary action button
<Button variant="primary" icon={<Plus className="h-4 w-4" />}>
  Add Item
</Button>

// Small action button in table
<Button size="sm" variant="outline" icon={<Edit className="h-4 w-4" />} />

// Loading button
<Button loading={isLoading} variant="success">
  Save Changes
</Button>

// Destructive action
<Button variant="danger" icon={<Trash2 className="h-4 w-4" />}>
  Delete
</Button>

// Filter/toggle button
<Button variant="ghost" size="sm">
  Filter Option
</Button>

// BEST PRACTICES
// 1. Use icon prop instead of inline icons
// 2. Consistent sizing within same context
// 3. Primary for main actions, outline for secondary
// 4. Small size for table actions
// 5. Loading state for async operations
// 6. Proper semantic variants (danger for delete, success for save)