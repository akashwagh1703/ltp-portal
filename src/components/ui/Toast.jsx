import { Toaster } from 'react-hot-toast'

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          padding: '12px 16px'
        },
        success: {
          iconTheme: {
            primary: '#16A34A',
            secondary: '#fff'
          }
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff'
          }
        }
      }}
    />
  )
}
